// 用户信息类型定义
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  // 可以根据实际需求添加更多字段
}

// 保存登录信息
export const setAuthData = (data: {
  accessToken: string;
  refreshToken: string;
  userInfo: UserInfo;
}) => {
  try {
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('user_info', JSON.stringify(data.userInfo));
  } catch (error) {
    console.error('Failed to save auth data:', error);
  }
};

// 获取用户信息
export const getUserInfo = (): UserInfo | null => {
  try {
    const userInfoStr = localStorage.getItem('user_info');
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (error) {
    console.error('Failed to parse user info:', error);
    return null;
  }
};

// 获取访问令牌
export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem('access_token');
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
};

// 获取刷新令牌
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem('refresh_token');
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

// 清除所有认证数据
export const clearAuthData = () => {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
};

// 检查是否已登录
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
}; 