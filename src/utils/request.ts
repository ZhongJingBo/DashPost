import { message } from "antd";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { clearAuthData } from "./auth";
import config from "../config/env";

export const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 3000,
  withCredentials: true, // 允许跨域请求携带凭证
});

// 类型定义
interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function;
}

interface RefreshResponse {
  data: {
    access_token?: string;
    refresh_token?: string;
  };
  code: number;
}

// 状态管理
let refreshing = false;
const queue: PendingTask[] = [];

// Token 相关函数
const setTokens = (data: RefreshResponse) => {


  localStorage.setItem("access_token", data.data.access_token || "");
  localStorage.setItem("refresh_token", data.data.refresh_token || "");
};

const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

// 请求队列处理
const processQueue = (axiosConfig: AxiosRequestConfig): Promise<AxiosResponse> => {
  queue.forEach(({ config, resolve }) => {
    resolve(axiosInstance(config));
  });
  queue.length = 0;
  return axiosInstance(axiosConfig);
};

// 重定向到登录页
const redirectToLogin = (errorMsg?: string) => {
  if (errorMsg) {
    message.error(errorMsg);
  }
  clearAuthData();
  setTimeout(() => {
    window.location.replace("/login");
  }, 1500);
};

// Token 刷新
const refreshToken = async () => {

  const refreshToken = getRefreshToken();
  console.log(refreshToken, 'getRefreshToken()');
  try {
    const res = await axiosInstance.get<RefreshResponse>("/user/refresh", {
      params: { refreshToken },
    });
    
    if (res.data.code === 200) {
      console.log(res.data, 'res.data');
      setTokens(res.data);
      return res;
    }
    throw new Error("Token refresh failed");
  } catch (error) {
    return Promise.reject(error);
  }
};

// 处理需要刷新token的请求
const handleTokenRefresh = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  if (refreshing) {
    return new Promise((resolve) => {
      queue.push({ config, resolve });
    });
  }

  refreshing = true;
  try {
    await refreshToken();
    refreshing = false;
    return processQueue(config);
  } catch (error) {
    refreshing = false;
    redirectToLogin("登录已过期，请重新登录");
    return Promise.reject(error);
  }
};

// 请求拦截器
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
axiosInstance.interceptors.response.use(
  async (response: AxiosResponse): Promise<AxiosResponse> => {
    const { config, data } = response;

    if (data.code === 200) {
      return response;
    }

    if (data.code === 401) {
      return handleTokenRefresh(config);
    }

    return response;
  },
  async (error): Promise<AxiosResponse> => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const { data, config } = error.response;
    
    if (data.code === 401 && !config.url.includes("/user/refresh")) {
      return handleTokenRefresh(config);
    }

    return error.response;
  }
);
