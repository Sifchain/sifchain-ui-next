import { createQueryClient } from "@sifchain/stargate";
import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";

export default function useQueryClient() {
  const { data: env } = useDexEnvironment();

  return useQuery(
    "sif-query-client",
    async () => {
      try {
        return await createQueryClient(env?.sifnodeUrl ?? "");
      } catch (error) {
        return null;
      }
    },
    {
      enabled: Boolean(env?.sifnodeUrl),
    },
  );
}
