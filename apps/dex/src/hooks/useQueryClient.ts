import { createQueryClient } from "@sifchain/stargate";
import { useQuery } from "react-query";

import { useDexEnvironment } from "~/domains/core/envs";

export default function useQueryClient() {
  const { data: env } = useDexEnvironment();

  return useQuery(
    ["sif-query-client", env?.kind],
    () => createQueryClient(env?.sifnodeUrl ?? ""),
    {
      enabled: Boolean(env?.sifnodeUrl),
    },
  );
}
