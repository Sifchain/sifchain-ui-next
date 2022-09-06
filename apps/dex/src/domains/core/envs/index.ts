import { getSdkConfig, NetworkEnv, NETWORK_ENVS } from "@sifchain/common";
import { useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { useFeatureFlag } from "~/lib/featureFlags";

export type DexEnvironment = {
  kind: NetworkEnv;
  sifnodeUrl: string;
  vanirUrl: string;
  registryUrl: string;
};

export function useDexEnvKind(): NetworkEnv {
  const [{ sif_dex_env }, setCookie] = useCookies(["sif_dex_env"]);
  const [resolvedEnv, setResolvedEnv] = useState<NetworkEnv | null>(null);

  const isMarginStandAloneOn = useFeatureFlag("margin-standalone");

  useEffect(() => {
    const queryString = new URLSearchParams(window.location.search);
    const envKind = queryString.get("_env");
    if (envKind && NETWORK_ENVS.has(envKind as NetworkEnv) && envKind !== sif_dex_env) {
      setCookie("sif_dex_env", envKind);
      setResolvedEnv(envKind as NetworkEnv);
    }
  }, [setCookie, sif_dex_env]);

  return useMemo(() => {
    if (isMarginStandAloneOn) {
      return "testnet";
    }
    return resolvedEnv ?? sif_dex_env ?? "mainnet";
  }, [resolvedEnv, sif_dex_env, isMarginStandAloneOn]);
}

export function useDexEnvironment() {
  const environment = useDexEnvKind();

  return useQuery(["dex_env", environment], async () => getSdkConfig({ environment }), {
    staleTime: 3600_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
