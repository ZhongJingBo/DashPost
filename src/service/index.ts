import { axiosInstance } from "../utils/request";

export const baseUrl = "/api";

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams extends LoginParams {
  email: string;
  confirmPassword: string;
}

export const register = (url: string, options: RequestInit) => {
  return fetch(baseUrl + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  }).then((res) => res.json());
};

export const loginService = (params: LoginParams) => {
  return axiosInstance.post("/user/login", params);
};

export const registerService = (params: RegisterParams) => {
  return axiosInstance.post("/user/register", params);
};

export const refreshTokenService = (refreshToken: string) => {
  return axiosInstance.get("/user/refresh", {
    params: { refresh_token: refreshToken },
  });
};

export const getListService = () => {
  return axiosInstance.get("/post/list");
};

export const getPostService = (id: string) => {
  return axiosInstance.get(`/post/detail/${id}`);
};

export const createPostService = (params: {
  title: string;
  content: string;
}) => {
  return axiosInstance.post("/post/create", params);
};

export const deletePostService = (id: string) => {
  return axiosInstance.get(`/post/deleteNote/${id}`);
};

export const updatePostService = (
  id: string,
  params: {
    title: string;
    content: string;
  }
) => {
  return axiosInstance.post(`/post/updateNote/${id}`, params);
};

export async function presignedUrl(fileName: string) {
  return axiosInstance.get(`/minio/presignedUrl?name=${fileName}`);
}

export async function getBucketImgs() {
  return axiosInstance.get(`/minio/bucket/blog-imgs`);
}

export const setPostStatusService = (id: string, status: string) => {
  return axiosInstance.post(`/post/updateStatus/${id}`, { status });
};
