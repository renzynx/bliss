declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    USE_SSL: "true" | "false";
    USE_PROXY: "true" | "false";
    PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    REDIS_URL: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USERNAME: string;
    MAIL_PASSWORD: string;
    MAIL_FROM: string;
    S3_ENDPOINT: string;
    S3_ACCESS_KEY_ID: string;
    S3_SECRET_ACCESS_KEY: string;
    S3_API_VERSION: string;
    S3_PATH: string;
    S3_BUCKET_NAME: string;
    S3_REGION: string;
    CDN_URL: string;
    UPLOADER: "local" | "s3";
  }
}
