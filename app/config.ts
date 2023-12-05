import config from "./config.json";

interface ChainConfig {
  tokenAddress: string;
}

interface AppConfig {
  chains: Record<string, ChainConfig>;
}

const appConfig: AppConfig = config;

export default appConfig;
