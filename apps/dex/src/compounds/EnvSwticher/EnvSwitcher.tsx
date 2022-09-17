import type { NetworkEnv } from "@sifchain/common";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDexEnvironment } from "~/domains/core/envs";

const ENVS: NetworkEnv[] = ["mainnet", "testnet", "devnet", "localnet", "tempnet"];

const ENV_CLASSNAMES: Record<NetworkEnv, string> = {
  mainnet: "bg-green-500 text-white",
  testnet: "bg-yellow-500 text-black",
  devnet: "bg-red-500 text-white",
  localnet: "bg-blue-500 text-white",
  tempnet: "bg-purple-500 text-white",
};

const EnvSwitcher = () => {
  const { data: env } = useDexEnvironment();

  const dexEnv = env?.kind ?? "mainnet";

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.location.href.includes("localhost") || window.location.href.includes(".vercel.app")) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <select
      className={clsx("fixed bottom-0 right-0 z-50 rounded p-4 pr-8", ENV_CLASSNAMES[dexEnv])}
      value={dexEnv}
      onChange={(e) => {
        if (e.target.value === dexEnv) return;

        const nextEnv = e.target.value as NetworkEnv;
        const url = new URL(window.location.href);
        url.searchParams.set("_env", nextEnv);

        setTimeout(() => {
          window.location.href = url.toString();
        }, 150);
      }}
    >
      {ENVS.map((env) => (
        <option key={env} value={env}>
          {env}
        </option>
      ))}
    </select>
  );
};

export default EnvSwitcher;
