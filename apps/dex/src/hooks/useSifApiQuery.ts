import type { createClient } from "@sifchain/sif-api";
import { ArgumentTypes, omit } from "rambda";
import { useQuery, UseQueryOptions } from "react-query";

import type { SafeKeyof } from "~/lib/type-utils";
import useSifApiClient from "./useSifApiClient";

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
export default function useSifApiQuery<
  T extends L1,
  P extends keyof VanirPublicClient[T],
  M = VanirPublicClient[T][P],
  F = M extends () => any ? ReturnType<M> : never,
  Res = Awaited<F>,
>(
  // @ts-ignore
  query: `${T}.${P}`,
  args: ArgumentTypes<VanirPublicClient[T][P]>,
  options: Omit<
    UseQueryOptions<Res, unknown, Res>,
    "queryKey" | "queryFn"
  > = {},
) {
  const { data: client } = useSifApiClient();

  return useQuery(
    [query],
    // @ts-ignore
    async (): Awaited<ReturnType<VanirPublicClient[T][P]>> => {
      const [moduleName, methodName] = query.split(".") as [T, P];

      // @ts-ignore
      const method = client[moduleName][methodName] as VanirPublicClient[T][P];

      // @ts-ignore
      const result = await method(...args);

      return result.body;
    },
    {
      enabled:
        "enabled" in options
          ? options.enabled && Boolean(client)
          : Boolean(client),
      ...(omit(["enabled"], options) as {}),
    },
  );
}
