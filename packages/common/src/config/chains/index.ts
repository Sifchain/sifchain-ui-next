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

export const CHAINCONFIG_BY_NETWORK_ENV: ChainConfigByNetworkEnv =
  Object.fromEntries(
    [...NETWORK_ENVS].map((env) => [
      env,
      Object.entries(CONFIG_LOOKUP).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value[env] }),
        {},
      ),
      ,
    ]),
  );
