import { NetworkEnv, NETWORK_ENVS } from "../getEnv";
import ethereum from "./ethereum";
import sifchain from "./sifchain";
import cosmoshub from "./cosmoshub";
import iris from "./iris";
import akash from "./akash";
import sentinel from "./sentinel";
import cryptoOrg from "./crypto-org";
import persistence from "./persistence";
import regen from "./regen";
import osmosis from "./osmosis";
import terra from "./terra";
import juno from "./juno";
import ixo from "./ixo";
import band from "./band";
import likecoin from "./likecoin";
import emoney from "./emoney";
import starname from "./starname";
import bitsong from "./bitsong";
import cerberus from "./cerberus";
import chihuahua from "./chihuahua";
import comdex from "./comdex";
import ki from "./ki";
import stargaze from "./stargaze";
import evmos from "./evmos";
import secret from "./secret";
import { ChainConfig, NetworkKind } from "../../entities";

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
