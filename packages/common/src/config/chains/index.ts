import { ChainConfig, NetworkKind } from "~/entities";
import { NetworkEnv, NETWORK_ENVS } from "~/config/getEnv";

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
import iris from "./iris";
import ixo from "./ixo";
import juno from "./juno";
import ki from "./ki";
import likecoin from "./likecoin";
import osmosis from "./osmosis";
import persistence from "./persistence";
import regen from "./regen";
import secret from "./secret";
import sentinel from "./sentinel";
import sifchain from "./sifchain";
import stargaze from "./stargaze";
import starname from "./starname";
import terra from "./terra";

export type ChainConfigByNetworkEnv = Record<
  NetworkEnv,
  Record<NetworkKind, ChainConfig>
>;

export const chainConfigByNetworkEnv = Object.fromEntries(
  [...NETWORK_ENVS].map((env) => {
    return [
      env,
      <Record<NetworkKind, ChainConfig>>{
        sifchain: sifchain[env],
        cosmoshub: cosmoshub[env],
        iris: iris[env],
        akash: akash[env],
        sentinel: sentinel[env],
        ethereum: ethereum[env],
        "crypto-org": cryptoOrg[env],
        osmosis: osmosis[env],
        persistence: persistence[env],
        regen: regen[env],
        terra: terra[env],
        juno: juno[env],
        ixo: ixo[env],
        band: band[env],
        bitsong: bitsong[env],
        likecoin: likecoin[env],
        emoney: emoney[env],
        evmos: evmos[env],
        starname: starname[env],
        cerberus: cerberus[env],
        chihuahua: chihuahua[env],
        comdex: comdex[env],
        ki: ki[env],
        stargaze: stargaze[env],
        secret: secret[env],
      },
    ];
  }),
) as ChainConfigByNetworkEnv;
