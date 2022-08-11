import type { createClient } from "@sifchain/sif-api";
import type { ValidPaths } from "@sifchain/ui";
import { ArgumentTypes, omit } from "rambda";
import { useQuery, UseQueryOptions } from "react-query";

import useSifApiClient from "./useSifApiClient";

export type VanirClient = Awaited<ReturnType<typeof createClient>>;

export type VanirPublicClient = Pick<
  VanirClient,
  "assets" | "network" | "pools" | "stats" | "trades" | "validators" | "margin"
>;

type PublicModuleKey = keyof VanirPublicClient;

type L1 = PublicModuleKey;
export type QueryKey = ValidPaths<VanirPublicClient>;

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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  query: QueryKey | `${T}.${P}`,
  args: ArgumentTypes<VanirPublicClient[T][P]>,
  options: Omit<
    UseQueryOptions<Res, unknown, Res>,
    "queryKey" | "queryFn"
  > = {},
) {
  const { data: client } = useSifApiClient();

  return useQuery(
    [query],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async (): Awaited<ReturnType<VanirPublicClient[T][P]>> => {
      if (!client) {
        throw new Error("[useSifApiQuery] No client available");
      }

      const [moduleName, methodName] = query.split(".") as [T, P];

      const method = client[moduleName][methodName];

      if (typeof method !== "function") {
        throw new Error(
          `[useSifApiQuery] Method ${String(methodName)} is not a function`,
        );
      }

      const result = await method(...args);

      // TODO: sifApi should return a standardized response type
      return "body" in result ? result.body : result;
    },
    {
      enabled:
        "enabled" in options
          ? options.enabled && Boolean(client)
          : Boolean(client),
      // eslint-disable-next-line @typescript-eslint/ban-types
      ...(omit(["enabled"], options) as {}),
    },
  );
}
