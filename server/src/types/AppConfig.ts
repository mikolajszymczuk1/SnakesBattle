export type DatabaseConfig = {
  databaseUrlLocal: string;
  databaseUrlTest: string;
};

export type ServerConfig = {
  port: number;
};

export type ApiConfig = {
  baseClientUrl: string;
  previewClientUrl: string;
};

export type AppConfig = {
  database: DatabaseConfig;
  server: ServerConfig;
  api: ApiConfig;
};
