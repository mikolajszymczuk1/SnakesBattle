import { AppConfig } from '@/types/AppConfig';

const config: AppConfig = {
  database: {
    databaseUrlLocal: process.env.DATABASE_URL_LOCAL ?? '',
    databaseUrlTest: process.env.DATABASE_URL_TEST ?? '',
  },
  server: {
    port: 8080,
  },
  api: {
    baseClientUrl: `http://localhost:5173`,
    previewClientUrl: `http://localhost:3000`,
  },
};

export default config;
