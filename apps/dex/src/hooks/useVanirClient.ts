import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";

import { createClient } from "@sifchain/vanir";

export default function useVanirClient() {
  const { data: env, isSuccess } = useDexEnvironment();

  return useQuery(
    ["sif-vanir-client", env?.kind],
    () => createClient(env?.vanirUrl ?? ""),
    {
      enabled: isSuccess && typeof env?.vanirUrl === "string",
    },
  );
}
