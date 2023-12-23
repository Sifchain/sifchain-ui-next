/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  createProtobufRpcClient,
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupStakingExtension,
  setupTxExtension,
} from "@cosmjs/stargate";
import { HttpEndpoint, Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClientImpl as ClpQueryClient } from "@sifchain/proto-types/sifnode/clp/v1/querier";
import { QueryClientImpl as DispensationQueryClient } from "@sifchain/proto-types/sifnode/dispensation/v1/query";
import { QueryClientImpl as EthBridgeQueryClient } from "@sifchain/proto-types/sifnode/ethbridge/v1/query";
import { QueryClientImpl as TokenRegistryQueryClient } from "@sifchain/proto-types/sifnode/tokenregistry/v1/query";
import { QueryClientImpl as MarginQueryClient } from "@sifchain/proto-types/sifnode/margin/v1/query";
import { QueryClientImpl as EpochsQueryClient } from "@sifchain/proto-types/sifnode/epochs/v1/query";
import type { Rpc, StringLiteral } from "./types";

const setupBareExtension =
  <TModule, TClient>(moduleName: StringLiteral<TModule>, client: { new (rpc: Rpc): TClient }) =>
  (base: QueryClient) => {
    const rpc = createProtobufRpcClient(base);
    const baseClient = new client(rpc);

    const clientWithUncapitalizedMethods = Object.fromEntries(
      Object.getOwnPropertyNames(Object.getPrototypeOf(baseClient))
        .filter((x) => x !== "constructor")
        .filter((x) => typeof (baseClient as never)[x] === "function")
        .map((x) => [x[0]?.toLowerCase() + x.slice(1), ((baseClient as never)[x] as Function).bind(baseClient)]),
    ) as {
      [P in keyof TClient as P extends string ? Uncapitalize<P> : P]: TClient[P];
    };

    return {
      [moduleName]: clientWithUncapitalizedMethods,
    } as {
      [P in StringLiteral<TModule>]: typeof clientWithUncapitalizedMethods;
    };
  };

const createQueryClientFromTmClient = (tmClient: Tendermint34Client) =>
  QueryClient.withExtensions(
    tmClient,
    setupAuthExtension,
    setupBankExtension,
    setupStakingExtension,
    setupTxExtension,
    setupBareExtension("clp", ClpQueryClient),
    setupBareExtension("dispensation", DispensationQueryClient),
    setupBareExtension("ethBridge", EthBridgeQueryClient),
    setupBareExtension("tokenRegistry", TokenRegistryQueryClient),
    setupBareExtension("margin", MarginQueryClient),
    setupBareExtension("epochs", EpochsQueryClient),
  );

const createQueryClientFromEndpoint = async (endpoint: string | HttpEndpoint) =>
  createQueryClientFromTmClient(await Tendermint34Client.connect(endpoint));

export type SifQueryClient = ReturnType<typeof createQueryClientFromTmClient>;

export function createQueryClient(endpoint: string | HttpEndpoint): Promise<SifQueryClient>;
export function createQueryClient(tmClient: Tendermint34Client): SifQueryClient;
export function createQueryClient(endpointOrTmClient: string | HttpEndpoint | Tendermint34Client): any {
  return endpointOrTmClient instanceof Tendermint34Client
    ? createQueryClientFromTmClient(endpointOrTmClient)
    : createQueryClientFromEndpoint(endpointOrTmClient);
}
