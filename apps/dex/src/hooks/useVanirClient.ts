import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";

import { createClient } from "@sifchain/vanir-client";

export default function useVanirClient() {
  const { data: env, isSuccess } = useDexEnvironment();

  return useQuery(
    ["sif-vanir-client", env?.kind],
    () => createClient({ basePath: env?.vanirUrl ?? "" }),
    {
      enabled: isSuccess && typeof env?.vanirUrl === "string",
    },
  );
}
