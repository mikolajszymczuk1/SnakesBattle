import type { Express } from 'express';
import dotenv from 'dotenv';
import { createApp } from './app';
import { getEnvConfig } from '@/conf/configLoader';
import type { AppConfig } from './types/AppConfig';

dotenv.config();

const env: string = process.env.ENV_MODE ?? 'local';
const appConfig: AppConfig = getEnvConfig(env);
const app: Express = createApp(appConfig);

app.listen(appConfig.server.port, (): void => {
  console.log(`Server is running at http://localhost:${appConfig.server.port}`);
});
