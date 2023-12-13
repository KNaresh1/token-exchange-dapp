import config from "./config.json";

interface ChainConfig {
  exchangeAddress: string;
  dappAddress: string;
  mETHAddress: string;
  mDAIAddress: string;
  explorerURL: string;
}

interface AppConfig {
  chains: Record<string, ChainConfig>;
}

const appConfig: AppConfig = config;

export default appConfig;
