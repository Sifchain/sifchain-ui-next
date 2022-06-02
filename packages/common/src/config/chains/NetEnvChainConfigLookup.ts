import { ChainConfig } from "~/entities";
import { NetworkEnv } from "../getEnv";

export type NetEnvChainConfigLookup = Record<NetworkEnv, ChainConfig>;
