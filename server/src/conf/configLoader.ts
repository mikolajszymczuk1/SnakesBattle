import configLocal from '@/conf/appLocal';
import type { AppConfig } from '@/types/AppConfig';

/**
 * Load app configuration base on env value
 * @param {string} envModeValue env mode value
 * @returns {AppConfig} app config
 */
export const getEnvConfig = (envModeValue: string = 'local'): AppConfig => {
  return configLocal;
};
