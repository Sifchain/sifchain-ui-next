import { createClient } from "@sifchain/sif-api";
import { useQuery } from "react-query";

import { useDexEnvironment } from "~/domains/core/envs";

export default function useSifApiClient() {
  const { data: env, isSuccess } = useDexEnvironment();

  return useQuery(
    ["sif-vanir-client", env?.vanirUrl],
    () => createClient({ basePath: env?.vanirUrl ?? "" }),
    {
      enabled: isSuccess && typeof env?.vanirUrl === "string",
    }
  );
}
