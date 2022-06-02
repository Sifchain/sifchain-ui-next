import { createQueryClient } from "@sifchain/stargate";
import { useQuery } from "react-query";

import { useDexEnvironment } from "~/domains/core/envs";

export default function useQueryClient() {
  const { data: env } = useDexEnvironment();

  return useQuery(
    ["sif-query-client", env?.sifRpcUrl],
    async () => {
      const client = await createQueryClient(env?.sifRpcUrl ?? "");

      return client;
    },
    {
      enabled: Boolean(env?.sifRpcUrl),
    },
  );
}
