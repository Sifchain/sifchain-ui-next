import { getSdkConfig, NetworkEnv } from "@sifchain/common";
import { useMemo } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";

export type DexEnvironment = {
  kind: NetworkEnv;
  sifnodeUrl: string;
  vanirUrl: string;
  registryUrl: string;
};

export function useDexEnvironment() {
  const [{ sif_dex_env }] = useCookies(["sif_dex_env"]);

  const environment = useMemo(
    () => String(sif_dex_env ?? "mainnet") as NetworkEnv,
    [sif_dex_env],
  );

  return useQuery(`dex_env_${environment}`, async () =>
    getSdkConfig({ environment }),
  );
}
