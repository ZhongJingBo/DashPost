interface Config {
  apiBaseUrl: string;
  minioUrl: string;
}

const isDev = import.meta.env.DEV;

const config: Config = {
  apiBaseUrl: isDev ? '/api' : 'http://postforge.zhongzhong.top',
  minioUrl: isDev ? 'http://localhost:9000' : 'http://your-production-minio-url:9000'  // 替换为你的生产环境 MinIO URL
};

export default config; 