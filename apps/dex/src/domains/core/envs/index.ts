import { getSdkConfig, NetworkEnv, NETWORK_ENVS } from "@sifchain/common";
import { useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";

export type DexEnvironment = {
  kind: NetworkEnv;
  sifnodeUrl: string;
  vanirUrl: string;
  registryUrl: string;
};

export function useDexEnvKind(): NetworkEnv {
  const [{ sif_dex_env }, setCookie] = useCookies(["sif_dex_env"]);
  const [resolvedEnv, setResolvedEnv] = useState<NetworkEnv | null>(null);

  useEffect(() => {
    const queryString = new URLSearchParams(window.location.search);
    const envKind = queryString.get("_env");
    if (envKind && NETWORK_ENVS.has(envKind as NetworkEnv) && envKind !== sif_dex_env) {
      setCookie("sif_dex_env", envKind);
      setResolvedEnv(envKind as NetworkEnv);
    }
    if (envKind) {
      const url = new URL(window.location.href);
      url.searchParams.delete("_env");
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [setCookie, sif_dex_env]);

  return useMemo(() => {
    return resolvedEnv ?? sif_dex_env ?? "mainnet";
  }, [resolvedEnv, sif_dex_env]);
}

export function useDexEnvironment() {
  const environment = useDexEnvKind();

  return useQuery(
    ["dex_env", environment],
    async () => {
      const config = await getSdkConfig({ environment });
      return {
        kind: environment,
        ...config,
      };
    },
    {
      staleTime: 3600_000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );
}
