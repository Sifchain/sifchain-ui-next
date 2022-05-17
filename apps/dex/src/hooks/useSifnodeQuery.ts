import { createQueryClient } from "@sifchain/stargate";
import { ArgumentTypes, ValueOfRecord } from "rambda";
import { useQuery, UseQueryOptions } from "react-query";
import useQueryClient from "./useQueryClient";

type Client = Awaited<ReturnType<typeof createQueryClient>>;

type SafeKeyof<T> = T extends Record<string, any> ? keyof T : never;

type PublicClient = Pick<
  Client,
  "clp" | "ethBridge" | "bank" | "dispensation" | "staking" | "tokenRegistry"
>;

type PublicModuleKey = keyof PublicClient;

const PUBLIC_MODULES: PublicModuleKey[] = [
  "clp",
  "ethBridge",
  "bank",
  "dispensation",
  "staking",
  "tokenRegistry",
];

type L1 = PublicModuleKey;
type L2 = SafeKeyof<Client[L1]>;

export type MessageKey = `${L1}.${L2}`;

type Handlers = {
  [L in MessageKey]: ValueOfRecord<Client[L1]>;
};

export function createHandlers(client: PublicClient) {
  const handlers = PUBLIC_MODULES.reduce<Handlers>(
    (acc, moduleName: PublicModuleKey) => {
      const targetModule = client[moduleName];

      const methods = Object.entries(targetModule).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [`${moduleName}.${key}`]: value,
        }),
        acc,
      );

      return { ...acc, ...methods };
    },
    {} as Handlers,
  );
  return handlers;
}

/**
 * Generic hook to access signode queries, with type inference
 *
 * @param message {string}
 * @param args {any}
 * @returns
 */
export default function useSifnodeQuery<
  T extends L1,
  P extends keyof PublicClient[T],
  M = PublicClient[T][P],
  F = M extends () => any ? ReturnType<M> : never,
  Res = Awaited<F>,
>(
  // @ts-ignore
  message: `${T}.${P}`,
  args: ArgumentTypes<PublicClient[T][P]>,
  options: Partial<UseQueryOptions<Res, unknown, Res>> = {},
) {
  const { data: client } = useQueryClient();

  return useQuery(
    [message],
    // @ts-ignore
    async (): Awaited<ReturnType<PublicClient[T][P]>> => {
      const [moduleName, methodName] = message.split(".") as [T, P];

      // @ts-ignore
      const method = client[moduleName][methodName] as PublicClient[T][P];

      // @ts-ignore
      return await method(...args);
    },
    {
      ...options,
      enabled:
        typeof options.enabled === "boolean"
          ? options.enabled && Boolean(client)
          : Boolean(client),
    },
  );
}
