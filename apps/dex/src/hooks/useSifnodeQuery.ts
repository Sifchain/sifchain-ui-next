import { createQueryClient } from "@sifchain/stargate";
import { ArgumentTypes } from "rambda";
import { useQuery, UseQueryOptions } from "react-query";

import { SafeKeyof } from "~/lib/type-utils";
import useQueryClient from "./useQueryClient";

export type SifnodeClient = Awaited<ReturnType<typeof createQueryClient>>;

export type PublicSifnodeClient = Pick<
  SifnodeClient,
  "clp" | "ethBridge" | "bank" | "dispensation" | "staking" | "tokenRegistry"
>;

type PublicModuleKey = keyof PublicSifnodeClient;

type L1 = PublicModuleKey;
type L2 = SafeKeyof<SifnodeClient[L1]>;

export type QueryKey = `${L1}.${L2}`;

/**
 * Generic hook to access Sifnode's queries, with type inference
 *
 * @param query {string}
 * @param args {any}
 * @returns
 */
export default function useSifnodeQuery<
  T extends L1,
  P extends keyof PublicSifnodeClient[T],
  M = PublicSifnodeClient[T][P],
  F = M extends () => any ? ReturnType<M> : never,
  Res = Awaited<F>,
>(
  // @ts-ignore
  query: QueryKey | `${T}.${P}`,
  args: ArgumentTypes<PublicSifnodeClient[T][P]>,
  options: Omit<
    UseQueryOptions<Res, unknown, Res>,
    "queryKey" | "queryFn"
  > = {},
) {
  const { data: client } = useQueryClient();

  return useQuery(
    [query],
    // @ts-ignore
    async (): Awaited<ReturnType<PublicSifnodeClient[T][P]>> => {
      const [moduleName, methodName] = query.split(".") as [T, P];

      // @ts-ignore
      const method = client[moduleName][
        methodName
      ] as PublicSifnodeClient[T][P];

      // @ts-ignore
      return await method(...args);
    },
    {
      refetchOnMount: Boolean(options.refetchOnMount),
      retry: options.retry,
      staleTime: options.staleTime,
      cacheTime: options.cacheTime,
      enabled:
        typeof options.enabled === "boolean"
          ? options.enabled && Boolean(client)
          : Boolean(client),
    },
  );
}
