import type { createQueryClient } from "@sifchain/stargate";
import { ArgumentTypes, omit } from "rambda";
import { useQuery, UseQueryOptions } from "react-query";

import useQueryClient from "./useQueryClient";

export type SifnodeClient = Awaited<ReturnType<typeof createQueryClient>>;

export type PublicSifnodeClient = Pick<
  SifnodeClient,
  "clp" | "ethBridge" | "bank" | "dispensation" | "staking" | "tokenRegistry"
>;

type PublicModuleKey = keyof PublicSifnodeClient;

/**
 * Generic hook to access Sifnode's queries, with type inference
 *
 * @param query {string}
 * @param args {any}
 * @returns
 */
export default function useSifnodeQuery<
  T extends PublicModuleKey,
  P extends keyof PublicSifnodeClient[T],
  M = PublicSifnodeClient[T][P],
  F = M extends () => any ? ReturnType<M> : never,
  Res = Awaited<F>,
>(
  // @ts-ignore
  query: `${T}.${P}`,
  args: ArgumentTypes<PublicSifnodeClient[T][P]>,
  options: Omit<
    UseQueryOptions<Res, unknown, Res>,
    "queryKey" | "queryFn"
  > = {},
) {
  const { data: client } = useQueryClient();

  return useQuery(
    [query, ...args],
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
      enabled:
        "enabled" in options
          ? options.enabled && Boolean(client)
          : Boolean(client),
      ...(omit(["enabled"], options) as {}),
    },
  );
}
