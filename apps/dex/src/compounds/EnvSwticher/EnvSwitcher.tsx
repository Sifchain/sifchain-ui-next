import type { NetworkEnv } from "@sifchain/common";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useDexEnvironment } from "~/domains/core/envs";

const ENVS: NetworkEnv[] = ["mainnet", "testnet", "devnet", "localnet", "tempnet"];

const ENV_CLASSNAMES: Record<NetworkEnv, string> = {
  mainnet: "ring-green-500/90 focus:ring-green-500/90 text-green-600",
  testnet: "ring-yellow-500/90 focus:ring-yellow-500/90 text-yellow-600",
  devnet: "ring-red-500/90 focus:ring-red-500/90 text-red-600",
  localnet: "ring-blue-500/90 focus:ring-blue-500/90 text-blue-600",
  tempnet: "ring-purple-500/90 focus:ring-purple-500/90 text-purple-600",
};

const Select = tw.select`
  text-ring fixed bottom-1 right-1 z-50 appearance-none rounded border-none
  bg-transparent p-4 pr-8 font-bold outline-none ring focus:ring cursor-pointer
`;

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
    <Select
      className={ENV_CLASSNAMES[dexEnv]}
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
    </Select>
  );
};

export default EnvSwitcher;
