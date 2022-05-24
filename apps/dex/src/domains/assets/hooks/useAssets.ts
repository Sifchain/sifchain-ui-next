import { getSdkConfig, NetworkEnv } from "@sifchain/core";
import { useMemo } from "react";

export default function useAssets(env: NetworkEnv) {
  return useMemo(() => {
    const config = getSdkConfig({
      environment: env,
    });

    return config.assets;
  }, []);
}
