import {
  Coin,
  GeneratedType,
  isTsProtoGeneratedType,
  OfflineSigner,
  Registry,
} from "@cosmjs/proto-signing";
import {
  AminoConverters,
  AminoTypes,
  createAuthzAminoConverters,
  createBankAminoConverters,
  createDistributionAminoConverters,
  createFreegrantAminoConverters,
  createGovAminoConverters,
  createIbcAminoConverters,
  createStakingAminoConverters,
  defaultRegistryTypes as defaultStargateTypes,
  SignerData,
  SigningStargateClient,
  SigningStargateClientOptions,
  StdFee,
} from "@cosmjs/stargate";
import { HttpEndpoint, Tendermint34Client } from "@cosmjs/tendermint-rpc";
import {
  calculatePriceImpact,
  calculateProviderFee,
  calculateSwapResult,
} from "@sifchain/math";
import * as clpTx from "@sifchain/proto-types/sifnode/clp/v1/tx";
import * as dispensationTx from "@sifchain/proto-types/sifnode/dispensation/v1/tx";
import * as ethBridgeTx from "@sifchain/proto-types/sifnode/ethbridge/v1/tx";
import * as tokenRegistryTx from "@sifchain/proto-types/sifnode/tokenregistry/v1/tx";
import BigNumber from "bignumber.js";
import type { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import type { Height } from "cosmjs-types/ibc/core/client/v1/client";
import Long from "long";
import { DEFAULT_GAS_PRICE } from "./fees";
import {
  convertToCamelCaseDeep,
  convertToSnakeCaseDeep,
  createAminoTypeNameFromProtoTypeUrl,
} from "./legacyUtils";
import type { CosmosEncodeObject, SifEncodeObject } from "./messages";
import { createQueryClient, SifQueryClient } from "./queryClient";

const MODULES = [clpTx, dispensationTx, ethBridgeTx, tokenRegistryTx];

const generateTypeUrlAndTypeRecords = (
  proto: Record<string, GeneratedType | any> & {
    protobufPackage: string;
  },
) =>
  Object.entries(proto)
    .filter(([_, value]) => isTsProtoGeneratedType(value))
    .map(([key, value]) => ({
      typeUrl: `/${proto.protobufPackage}.${key}`,
      type: value,
    }));

const createSifchainAminoConverters = (): AminoConverters =>
  Object.fromEntries(
    MODULES.flatMap(generateTypeUrlAndTypeRecords).map((x) => [
      x.typeUrl,
      {
        aminoType: createAminoTypeNameFromProtoTypeUrl(x.typeUrl),
        toAmino: (value) => convertToSnakeCaseDeep(value),
        fromAmino: (value) => convertToCamelCaseDeep(value),
      },
    ]),
  );

export const createDefaultTypes = (prefix: string) =>
  new AminoTypes({
    ...createAuthzAminoConverters(),
    ...createBankAminoConverters(),
    ...createDistributionAminoConverters(),
    ...createGovAminoConverters(),
    ...createStakingAminoConverters(prefix),
    ...createIbcAminoConverters(),
    ...createFreegrantAminoConverters(),
    ...createSifchainAminoConverters(),
  });

export const createDefaultRegistry = () => {
  const registry = new Registry(defaultStargateTypes);
  MODULES.flatMap(generateTypeUrlAndTypeRecords).forEach((x) =>
    registry.register(x.typeUrl, x.type),
  );
  return registry;
};

export class SifSigningStargateClient extends SigningStargateClient {
  static override async connectWithSigner(
    endpoint: string | HttpEndpoint,
    signer: OfflineSigner,
    options: SigningStargateClientOptions = {},
  ) {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new this(tmClient, signer, options);
  }

  static override async offline(
    signer: OfflineSigner,
    options: SigningStargateClientOptions = {},
  ) {
    return new this(undefined, signer, options);
  }

  private readonly sifQueryClient: SifQueryClient | undefined;

  protected constructor(
    tmClient: Tendermint34Client | undefined,
    signer: OfflineSigner,
    options: SigningStargateClientOptions,
  ) {
    super(tmClient, signer, {
      prefix: "sif",
      registry: createDefaultRegistry(),
      aminoTypes: createDefaultTypes(options.prefix ?? "sif"),
      gasPrice: DEFAULT_GAS_PRICE,
      ...options,
    });

    this.sifQueryClient =
      tmClient !== undefined ? createQueryClient(tmClient) : undefined;
  }

  override simulate(
    signerAddress: string,
    messages: readonly (SifEncodeObject | CosmosEncodeObject)[],
    memo: string | undefined,
  ) {
    return super.simulate(signerAddress, messages, memo);
  }

  override sign(
    signerAddress: string,
    messages: readonly (SifEncodeObject | CosmosEncodeObject)[],
    fee: StdFee,
    memo: string,
    explicitSignerData?: SignerData,
  ): Promise<TxRaw> {
    return super.sign(signerAddress, messages, fee, memo, explicitSignerData);
  }

  override signAndBroadcast(
    signerAddress: string,
    messages: readonly (SifEncodeObject | CosmosEncodeObject)[],
    fee: number | StdFee | "auto",
    memo?: string,
  ) {
    return super.signAndBroadcast(signerAddress, messages, fee, memo);
  }

  protected override getQueryClient() {
    return this.sifQueryClient;
  }

  protected override forceGetQueryClient() {
    if (this.sifQueryClient === undefined) {
      throw new Error(
        "Query client not available. You cannot use online functionality in offline mode.",
      );
    }

    return this.sifQueryClient;
  }

  async exportIBCTokens(
    senderAddress: string,
    recipientAddress: string,
    transferAmount: Coin,
    sourcePort: string | undefined = "transfer",
    timeoutHeight: Height | undefined,
    timeoutTimestamp: number | undefined,
    fee: StdFee | "auto" | number,
    memo?: string,
  ) {
    const registry = await this.forceGetTokenRegistryEntry(
      transferAmount.denom,
    );

    return this.sendIbcTokens(
      senderAddress,
      recipientAddress,
      transferAmount,
      sourcePort,
      registry.ibcChannelId,
      timeoutHeight,
      timeoutTimestamp,
      fee,
      memo,
    );
  }

  async importIBCTokens(
    counterPartySigningStargateClient: SigningStargateClient,
    senderAddress: string,
    recipientAddress: string,
    transferAmount: Coin,
    sourcePort: string | undefined = "transfer",
    timeoutHeight: Height | undefined,
    timeoutTimestamp: number | undefined,
    fee: StdFee | "auto" | number,
    memo?: string,
  ) {
    const registry = await this.forceGetTokenRegistryEntry(
      transferAmount.denom,
    );

    return counterPartySigningStargateClient.sendIbcTokens(
      senderAddress,
      recipientAddress,
      transferAmount,
      sourcePort,
      registry.ibcCounterpartyChannelId,
      timeoutHeight,
      timeoutTimestamp,
      fee,
      memo,
    );
  }

  async sendTokensToEth(
    senderAddress: string,
    recipientAddress: string,
    transferAmount: Coin,
    // default values from old sdk
    // 0x1 is mainnet 0x3 is ropsten
    ethChainId: number | string = 0x1,
    ethFee = "35370000000000000",
    fee: StdFee | "auto" | number,
    memo?: string,
  ) {
    return this.signAndBroadcast(
      senderAddress,
      [
        {
          typeUrl: this.isBridgedEthCoin(transferAmount)
            ? "/sifnode.ethbridge.v1.MsgBurn"
            : "/sifnode.ethbridge.v1.MsgLock",
          value: {
            cosmosSender: senderAddress,
            amount: transferAmount.amount,
            symbol: transferAmount.denom,
            ethereumChainId: Long.fromValue(ethChainId),
            ethereumReceiver: recipientAddress,
            cethAmount: ethFee,
          },
        },
      ],
      fee,
      memo,
    );
  }

  async minimumReceivedFromSwap(
    fromCoin: Coin,
    toCoinDenom: string,
  ): Promise<BigNumber.Value> {
    if (fromCoin.denom === toCoinDenom) {
      throw new Error("Can't swap to the same coin");
    }

    const queryClient = this.forceGetQueryClient();

    if (this.isNativeCoin(fromCoin.denom)) {
      const poolRes = await queryClient.clp.getPool({ symbol: toCoinDenom });
      const pmtpParamsRes = await queryClient.clp.getPmtpParams({});

      const swapResult = calculateSwapResult(
        fromCoin.amount,
        poolRes.pool?.nativeAssetBalance ?? 0,
        poolRes.pool?.externalAssetBalance ?? 0,
        pmtpParamsRes.pmtpRateParams?.pmtpPeriodBlockRate,
      );

      const priceImpact = calculatePriceImpact(
        fromCoin.amount,
        poolRes.pool?.nativeAssetBalance ?? 0,
      );

      const providerFee = calculateProviderFee(
        fromCoin.amount,
        poolRes.pool?.nativeAssetBalance ?? 0,
        poolRes.pool?.externalAssetBalance ?? 0,
      );

      return swapResult.times(priceImpact.minus(1).abs()).minus(providerFee);
    } else if (this.isNativeCoin(toCoinDenom)) {
      const poolRes = await queryClient.clp.getPool({
        symbol: fromCoin.denom,
      });
      const pmtpParamsRes = await queryClient.clp.getPmtpParams({});

      const swapResult = calculateSwapResult(
        fromCoin.amount,
        poolRes.pool?.externalAssetBalance ?? 0,
        poolRes.pool?.nativeAssetBalance ?? 0,
        pmtpParamsRes.pmtpRateParams?.pmtpPeriodBlockRate,
      );

      const priceImpact = calculatePriceImpact(
        fromCoin.amount,
        poolRes.pool?.externalAssetBalance ?? 0,
      );

      const providerFee = calculateProviderFee(
        fromCoin.amount,
        poolRes.pool?.externalAssetBalance ?? 0,
        poolRes.pool?.nativeAssetBalance ?? 0,
      );

      return swapResult.times(priceImpact.minus(1).abs()).minus(providerFee);
    }

    // TODO: implement non-native to non-native swap
    return new BigNumber(0);
  }

  private async forceGetTokenRegistryEntry(denom: string) {
    const tokenRegistryEntries =
      await this.forceGetQueryClient().tokenRegistry.entries({});

    const registry = tokenRegistryEntries.registry?.entries.find(
      (x) => x.denom === denom,
    );

    if (registry === undefined) {
      throw new Error("Coin not in token registry");
    }

    return registry;
  }

  // TODO: only keep sifBridge check once we migrated to Peggy2
  private isBridgedEthCoin(coin: Coin) {
    return (
      coin.denom !== "rowan" &&
      !coin.denom.startsWith("ibc/") &&
      (coin.denom.startsWith("c") || coin.denom.startsWith("sifBridge"))
    );
  }

  private isNativeCoin(coin: Coin | string) {
    return typeof coin === "string" ? coin === "rowan" : coin.denom === "rowan";
  }
}
