declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      SESSION_SECRET: string;
      REDIS_URL: string;
      WEB_DOMAIN: string;
      NEXT_PUBLIC_API_URL: string;
      USE_HTTPS: 'true' | 'false';
      USE_S3?: 'true' | 'false';
      S3_ACCESS_KEY_ID?: string;
      S3_SECRET_ACCESS_KEY?: string;
      S3_REGION?: string;
      S3_BUCKET?: string;
      S3_FORCE_PATH_STYLE?: string;
      S3_ENDPOINT?: string;
    }
  }
}

export {};
