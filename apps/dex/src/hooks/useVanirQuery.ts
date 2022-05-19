import { createClient } from "@sifchain/vanir-client";
import { ArgumentTypes } from "rambda";
import { useQuery, UseQueryOptions } from "react-query";

import { SafeKeyof } from "~/lib/type-utils";
import useVanirClient from "./useVanirClient";

export type VanirClient = Awaited<ReturnType<typeof createClient>>;

export type VanirPublicClient = Pick<
  VanirClient,
  "assets" | "network" | "pools" | "stats" | "trades" | "validators"
>;

type PublicModuleKey = keyof VanirPublicClient;

type L1 = PublicModuleKey;
type L2 = SafeKeyof<VanirClient[L1]>;

export type QueryKey = `${L1}.${L2}`;

/**
 * Generic hook to access Vanir queries, with type inference
 *
 * @param query {string}
 * @param args {any}
 * @returns
 */
export default function useVanirQuery<
  T extends L1,
  P extends keyof VanirPublicClient[T],
  M = VanirPublicClient[T][P],
  F = M extends () => any ? ReturnType<M> : never,
  Res = Awaited<F>,
>(
  // @ts-ignore
  query: QueryKey | `${T}.${P}`,
  args: ArgumentTypes<VanirPublicClient[T][P]>,
  options: Omit<
    UseQueryOptions<Res, unknown, Res>,
    "queryKey" | "queryFn"
  > = {},
) {
  const { data: client } = useVanirClient();

  return useQuery(
    [query],
    // @ts-ignore
    async (): Awaited<ReturnType<VanirPublicClient[T][P]>> => {
      const [moduleName, methodName] = query.split(".") as [T, P];

      // @ts-ignore
      const method = client[moduleName][methodName] as VanirPublicClient[T][P];

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
