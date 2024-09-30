import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { json } from 'body-parser';
import type { AppConfig } from '@/types/AppConfig';
import exampleRouter from '@/routers/exampleRouter';

/**
 * Create app object
 * @param {AppConfig} config all config properties for application based on env mode
 * @returns {Express} express app instance
 */
export const createApp = (config: AppConfig): Express => {
  const app: Express = express();

  // Modules
  app.use(json());
  app.use(helmet());
  app.use(cors({ origin: [config.api.baseClientUrl, config.api.previewClientUrl] }));

  // Routers
  app.use('/api', exampleRouter);

  return app;
};
