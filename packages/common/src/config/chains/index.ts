import { NetworkEnv, NETWORK_ENVS } from "~/config/getEnv";
import { ChainConfig, NetworkKind } from "~/entities";
import akash from "./akash";
import band from "./band";
import bitsong from "./bitsong";
import cerberus from "./cerberus";
import chihuahua from "./chihuahua";
import comdex from "./comdex";
import cosmoshub from "./cosmoshub";
import cryptoOrg from "./crypto-org";
import emoney from "./emoney";
import ethereum from "./ethereum";
import evmos from "./evmos";
import gravity from "./gravity";
import iris from "./iris";
import ixo from "./ixo";
import juno from "./juno";
import ki from "./ki";
import likecoin from "./likecoin";
import { NetEnvChainConfigLookup } from "./NetEnvChainConfigLookup";
import osmosis from "./osmosis";
import persistence from "./persistence";
import regen from "./regen";
import secret from "./secret";
import sentinel from "./sentinel";
import sifchain from "./sifchain";
import stargaze from "./stargaze";
import starname from "./starname";
import terra from "./terra";

const CONFIG_LOOKUP: Record<NetworkKind, NetEnvChainConfigLookup> = {
  akash,
  band,
  bitsong,
  cerberus,
  chihuahua,
  comdex,
  cosmoshub,
  "crypto-org": cryptoOrg,
  emoney,
  ethereum,
  evmos,
  gravity,
  iris,
  ixo,
  juno,
  ki,
  likecoin,
  osmosis,
  persistence,
  regen,
  secret,
  sentinel,
  sifchain,
  stargaze,
  starname,
  terra,
};

export type ChainConfigByNetworkEnv = Record<
  NetworkEnv,
  Record<NetworkKind, ChainConfig>
>;

function getChainConfigWithFallbackOrThrow(
  env: NetworkEnv,
  networkKind: NetworkKind,
  networkLookup: NetEnvChainConfigLookup,
) {
  const config = networkLookup[env];

  if (!config) {
    const envMatch = (["testnet", "mainnet"] as NetworkEnv[]).find(
      (env) => networkLookup[env] !== undefined,
    );

    if (!envMatch) {
      throw new Error(
        `No config found for network "${networkKind}" on env "${env}"`,
      );
    }

    console.warn(
      `[network:${networkKind}] ${env} config fallback to ${envMatch}`,
    );
    return networkLookup[envMatch];
  }

  return config;
}

export const CHAINCONFIG_BY_NETWORK_ENV = Object.fromEntries(
  [...NETWORK_ENVS].map((env) => [
    env,
    Object.entries(CONFIG_LOOKUP).reduce(
      (acc, [networkKind, networkLookup]) => {
        const config = getChainConfigWithFallbackOrThrow(
          env,
          networkKind as NetworkKind,
          networkLookup,
        );

        return {
          ...acc,
          [networkKind]: config,
        };
      },
      {},
    ),
  ]),
) as ChainConfigByNetworkEnv;
