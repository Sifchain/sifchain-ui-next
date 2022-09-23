import { Decimal } from "@cosmjs/math";
import { Coin, GeneratedType, isTsProtoGeneratedType, OfflineSigner, Registry } from "@cosmjs/proto-signing";
import {
  AminoConverter,
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
  StargateClient,
  StargateClientOptions,
  StdFee,
} from "@cosmjs/stargate";
import { HttpEndpoint, Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { calculatePriceImpact, SwapParams, calculateSwapWithFee } from "@sifchain/math";
import * as clpTx from "@sifchain/proto-types/sifnode/clp/v1/tx";
import * as dispensationTx from "@sifchain/proto-types/sifnode/dispensation/v1/tx";
import * as ethBridgeTx from "@sifchain/proto-types/sifnode/ethbridge/v1/tx";
import * as marginTx from "@sifchain/proto-types/sifnode/margin/v1/tx";
import * as tokenRegistryTx from "@sifchain/proto-types/sifnode/tokenregistry/v1/tx";
import BigNumber from "bignumber.js";
import type { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import type { Height } from "cosmjs-types/ibc/core/client/v1/client";
import Long from "long";

import { DEFAULT_GAS_PRICE } from "./fees";
import { convertToCamelCaseDeep, convertToSnakeCaseDeep, createAminoTypeNameFromProtoTypeUrl } from "./legacyUtils";
import type { CosmosEncodeObject, SifEncodeObject } from "./messages";
import { createQueryClient, SifQueryClient } from "./queryClient";

const NATIVE_ASSET_DENOM = "rowan";

// Must be updated whenever a new module is added to sifnode
const MODULES = [clpTx, dispensationTx, ethBridgeTx, tokenRegistryTx, marginTx];

const generateTypeUrlAndTypeRecords = (
  proto: Record<string, GeneratedType | unknown> & {
    protobufPackage: string;
  },
) =>
  Object.entries(proto)
    .filter(([_, value]) => isTsProtoGeneratedType(value as GeneratedType))
    .map(([key, value]) => ({
      typeUrl: `/${proto.protobufPackage}.${key}`,
      type: value as GeneratedType,
    }));

const createSifchainAminoConverters = (): AminoConverters =>
  Object.fromEntries<AminoConverter>(
    MODULES.flatMap(generateTypeUrlAndTypeRecords).map((proto) => [
      proto.typeUrl,
      {
        aminoType: createAminoTypeNameFromProtoTypeUrl(proto.typeUrl),
        toAmino: (value) => convertToSnakeCaseDeep(value) as unknown,
        fromAmino: (value) => convertToCamelCaseDeep(value) as unknown,
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
  MODULES.flatMap(generateTypeUrlAndTypeRecords).forEach((x) => registry.register(x.typeUrl, x.type));
  return registry;
};

export class SifSigningStargateClient extends SigningStargateClient {
  /**
   * Create a stargate client with read-only capabilities
   * @param endpoint
   * @param options
   * @returns
   */
  static override async connect(endpoint: string | HttpEndpoint, options: StargateClientOptions = {}) {
    const tmClient = await Tendermint34Client.connect(endpoint);

    // TODO: very dirty way of working around how
    // StargateClient & SigningStargateClient inheritance was implemented
    return new this(tmClient, {} as OfflineSigner, options) as StargateClient &
      Pick<SifSigningStargateClient, "simulateSwap" | "simulateSwapSync">;
  }

  /**
   * Create a stargate client capable of signing transactions
   * @param endpoint
   * @param signer
   * @param options
   * @returns
   */
  static override async connectWithSigner(
    endpoint: string | HttpEndpoint,
    signer: OfflineSigner,
    options: SigningStargateClientOptions = {},
  ) {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new this(tmClient, signer, options);
  }

  /**
   * Create a stargate client with no online functionalities
   * @param signer
   * @param options
   * @returns
   */
  static override offline(signer: OfflineSigner, options: SigningStargateClientOptions = {}) {
    return Promise.resolve(new this(undefined, signer, options));
  }

  readonly #sifQueryClient: SifQueryClient | undefined;

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

    this.#sifQueryClient = tmClient !== undefined ? createQueryClient(tmClient) : undefined;
  }

  override simulate(
    signerAddress: string,
    messages: readonly (SifEncodeObject | CosmosEncodeObject)[],
    memo: string | undefined,
  ) {
    return super.simulate(signerAddress, messages, memo);
  }

  /**
   * Sign and Sifchain supported transactions
   * @param signerAddress
   * @param messages
   * @param fee
   * @param memo
   * @param explicitSignerData
   * @returns
   */
  override sign(
    signerAddress: string,
    messages: readonly (SifEncodeObject | CosmosEncodeObject)[],
    fee: StdFee,
    memo: string,
    explicitSignerData?: SignerData,
  ): Promise<TxRaw> {
    return super.sign(signerAddress, messages, fee, memo, explicitSignerData);
  }

  /**
   *
   * @param signerAddress Sign and broadcast Sifchain supported transactions
   * @param messages
   * @param fee
   * @param memo
   * @returns
   */
  override signAndBroadcast(
    signerAddress: string,
    messages: readonly (SifEncodeObject | CosmosEncodeObject)[],
    fee: number | StdFee | "auto",
    memo?: string,
  ) {
    return super.signAndBroadcast(signerAddress, messages, fee, memo);
  }

  protected override getQueryClient() {
    return this.#sifQueryClient;
  }

  protected override forceGetQueryClient() {
    if (this.#sifQueryClient === undefined) {
      throw new Error("Query client not available. You cannot use online functionality in offline mode.");
    }

    return this.#sifQueryClient;
  }

  /**
   * Export IBC tokens to IBC compatible chain
   * @param senderAddress
   * @param recipientAddress
   * @param transferAmount
   * @param sourcePort
   * @param timeoutHeight
   * @param timeoutTimestamp
   * @param fee
   * @param memo
   * @returns
   */
  async exportIbcTokens(
    senderAddress: string,
    recipientAddress: string,
    transferAmount: Coin,
    sourcePort: string | undefined = "transfer",
    timeoutHeight: Height | undefined,
    timeoutTimestamp: number | undefined,
    fee: StdFee | "auto" | number,
    memo?: string,
  ) {
    const registry = await this.#forceGetTokenRegistryEntry(transferAmount.denom);

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

  /**
   * Import IBC compatible tokens from IBC compatible chain
   * @param counterPartySigningStargateClient
   * @param senderAddress
   * @param recipientAddress
   * @param transferAmount
   * @param sourcePort
   * @param timeoutHeight
   * @param timeoutTimestamp
   * @param fee
   * @param memo
   * @returns
   */
  async importIbcTokens(
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
    const registry = await this.#forceGetTokenRegistryEntry(transferAmount.denom);

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

  /**
   * Send tokens to Evm chain via Peggy bridge bank
   * @param senderAddress
   * @param recipientAddress
   * @param transferAmount
   * @param ethChainId
   * @param ethFee
   * @param fee
   * @param memo
   * @returns
   */
  async sendTokensToEth(
    senderAddress: string,
    recipientAddress: string,
    transferAmount: Coin,
    ethChainId = 1,
    ethFee = "35370000000000000",
    fee: StdFee | "auto" | number,
    memo?: string,
  ) {
    return this.signAndBroadcast(
      senderAddress,
      [
        {
          typeUrl: this.#isBridgedEthCoin(transferAmount)
            ? "/sifnode.ethbridge.v1.MsgBurn"
            : "/sifnode.ethbridge.v1.MsgLock",
          value: {
            cosmosSender: senderAddress,
            amount: transferAmount.amount,
            symbol: transferAmount.denom,
            ethereumChainId: Long.fromNumber(ethChainId),
            ethereumReceiver: recipientAddress,
            cethAmount: ethFee,
          },
        },
      ],
      fee,
      memo,
    );
  }

  /**
   * requires pre-fetched pool balances & PMTP block rate
   * useful when lots of swap simulation are required (i.e. text box with real-time update)
   * @param fromCoin
   * @param toCoin
   * @param pmtpBlockRate
   * @param slippage
   * @returns
   */
  simulateSwapSync(
    fromCoin: Coin & {
      poolExternalAssetBalance: string;
      poolNativeAssetBalance: string;
    },
    toCoin: Omit<Coin, "amount"> & {
      poolExternalAssetBalance: string;
      poolNativeAssetBalance: string;
    },
    pmtpBlockRate?: string,
    slippage?: number | string,
    swapFeeRate?: string,
  ) {
    const result = this.#simulateAutoCompositePoolSwap(fromCoin, toCoin, pmtpBlockRate, swapFeeRate, slippage);

    return {
      rawReceiving: result.rawReceiving.integerValue().toFixed(0),
      minimumReceiving: result.minimumReceiving.integerValue().toFixed(0),
      liquidityProviderFee: result.liquidityProviderFee.integerValue().toFixed(0),
      priceImpact: result.priceImpact.toNumber(),
    };
  }

  /**
   * asynchronous method for simulating swap
   * if lots of swap simulations are required,
   * use {@link simulateSwapSync} instead
   * @param fromCoin
   * @param toCoin
   * @param slippage value between 0 and 1
   * @returns
   */
  async simulateSwap(fromCoin: Coin, toCoin: Omit<Coin, "amount">, slippage?: number | string) {
    const queryClient = this.forceGetQueryClient();

    if (fromCoin.denom === toCoin.denom) {
      throw new Error("Can't swap to the same coin");
    }

    // use one pool when it's rowan -> coin or coin -> rowan
    // else 2 pools are required
    const [firstPoolRes, secondPoolRes] = await (async () => {
      if (this.#isNativeCoin(fromCoin)) {
        const poolRes = await queryClient.clp.getPool({
          symbol: toCoin.denom,
        });
        return [poolRes, poolRes];
      }

      if (this.#isNativeCoin(toCoin.denom)) {
        const poolRes = await queryClient.clp.getPool({
          symbol: fromCoin.denom,
        });

        return [poolRes, poolRes];
      }

      return await Promise.all([
        queryClient.clp.getPool({ symbol: fromCoin.denom }),
        queryClient.clp.getPool({ symbol: toCoin.denom }),
      ]);
    })();

    const [pmtpParamsRes, swapFeeRateRes] = await Promise.all([
      queryClient.clp.getPmtpParams({}),
      queryClient.clp.getSwapFeeRate({}),
    ]);

    const swapResult = this.#simulateAutoCompositePoolSwap(
      {
        ...fromCoin,
        poolNativeAssetBalance: firstPoolRes.pool?.nativeAssetBalance ?? "0",
        poolExternalAssetBalance: firstPoolRes.pool?.externalAssetBalance ?? "0",
      },
      {
        ...toCoin,
        poolNativeAssetBalance: secondPoolRes.pool?.nativeAssetBalance ?? "0",
        poolExternalAssetBalance: secondPoolRes.pool?.externalAssetBalance ?? "0",
      },
      pmtpParamsRes.pmtpRateParams?.pmtpPeriodBlockRate,
      swapFeeRateRes.swapFeeRate,
      slippage,
    );

    return this.#parseSwapResult(swapResult, toCoin.denom);
  }

  #simulateAutoCompositePoolSwap(
    fromCoin: Coin & {
      poolExternalAssetBalance: string;
      poolNativeAssetBalance: string;
    },
    toCoin: Omit<Coin, "amount"> & {
      poolExternalAssetBalance: string;
      poolNativeAssetBalance: string;
    },
    pmtpBlockRate?: string,
    swapFeeRate?: string,
    slippage?: number | string,
  ) {
    if (fromCoin.denom === toCoin.denom) {
      throw new Error("Can't swap to the same coin");
    }

    // rowan -> coin
    if (this.#isNativeCoin(fromCoin.denom)) {
      return this.#simulateSwap(
        {
          amount: fromCoin.amount,
          poolBalance: fromCoin.poolNativeAssetBalance,
          denom: fromCoin.denom,
        },
        {
          poolBalance: toCoin.poolExternalAssetBalance,
          denom: toCoin.denom,
        },
        pmtpBlockRate,
        swapFeeRate,
        slippage,
      );
    }

    // coin -> rowan
    if (this.#isNativeCoin(toCoin.denom)) {
      return this.#simulateSwap(
        {
          amount: fromCoin.amount,
          poolBalance: fromCoin.poolExternalAssetBalance,
          denom: fromCoin.denom,
        },
        {
          poolBalance: toCoin.poolNativeAssetBalance,
          denom: toCoin.denom,
        },
        pmtpBlockRate,
        swapFeeRate,
        slippage,
      );
    }

    // if neither coins is rowan then we need to do coin1 -> rowan -> coin2
    const firstSwap = this.#simulateSwap(
      {
        amount: fromCoin.amount,
        poolBalance: fromCoin.poolExternalAssetBalance,
        denom: fromCoin.denom,
      },
      {
        poolBalance: fromCoin.poolNativeAssetBalance,
        denom: NATIVE_ASSET_DENOM,
      },
      pmtpBlockRate,
      swapFeeRate,
    );

    const firstSwapConvertedLpFee = this.#simulateSwap(
      {
        amount: firstSwap.liquidityProviderFee.toString(),
        poolBalance: toCoin.poolNativeAssetBalance,
        denom: toCoin.denom,
      },
      {
        poolBalance: toCoin.poolExternalAssetBalance,
        denom: toCoin.denom,
      },
      pmtpBlockRate,
      swapFeeRate,
    );

    const secondSwap = this.#simulateSwap(
      {
        amount: firstSwap.rawReceiving.toString(),
        poolBalance: toCoin.poolNativeAssetBalance,
        denom: toCoin.denom,
      },
      {
        poolBalance: toCoin.poolExternalAssetBalance,
        denom: toCoin.denom,
      },
      pmtpBlockRate,
      swapFeeRate,
      slippage,
    );

    return {
      ...secondSwap,
      priceImpact: firstSwap.priceImpact.plus(secondSwap.priceImpact),
      liquidityProviderFee: firstSwapConvertedLpFee.rawReceiving.plus(secondSwap.liquidityProviderFee),
    };
  }

  #simulateSwap(
    fromCoin: {
      amount: string;
      poolBalance: string;
      denom: string;
    },
    toCoin: {
      poolBalance: string;
      denom: string;
    },
    pmtpBlockRate?: string,
    swapFeeRate?: string,
    slippage?: number | string,
  ) {
    const swapParams: SwapParams = {
      inputAmount: fromCoin.amount,
      inputBalanceInPool: fromCoin.poolBalance,
      outputBalanceInPool: toCoin.poolBalance,
      currentRatioShiftingRate: pmtpBlockRate ?? "0",
      swapFeeRate: swapFeeRate ?? "0",
    };
    const isSwappingToNativeCoin = this.#isNativeCoin(toCoin.denom);
    const { swap, fee } = calculateSwapWithFee(swapParams, isSwappingToNativeCoin);

    const priceImpact = calculatePriceImpact(fromCoin.amount, fromCoin.poolBalance);

    return {
      rawReceiving: swap,
      priceImpact,
      liquidityProviderFee: fee,
      minimumReceiving: BigNumber.max(
        0,
        swap
          .minus(fee)
          .times(priceImpact.minus(1).abs())
          .times(new BigNumber(1).minus(slippage ?? 0)),
      ),
    };
  }

  /**
   * Convert BigNumber to cosmjs Decimal to keep with cosmjs standard
   * @param result
   * @param toCoinDenom
   * @returns
   */
  async #parseSwapResult(
    result: {
      rawReceiving: BigNumber;
      minimumReceiving: BigNumber;
      priceImpact: BigNumber;
      liquidityProviderFee: BigNumber;
    },
    toCoinDenom: string,
  ) {
    const queryClient = this.forceGetQueryClient();
    const tokenRegistryRes = await queryClient.tokenRegistry.entries({});
    const tokenRecord = tokenRegistryRes.registry?.entries.find((x) => x.denom === toCoinDenom);

    if (tokenRecord === undefined) {
      throw new Error(`No token record found for denom ${toCoinDenom}`);
    }

    const toCosmJsDecimal = (bn: BigNumber) =>
      Decimal.fromAtomics(bn.integerValue().toFixed(0).toString(), tokenRecord.decimals.toNumber());

    return {
      rawReceiving: toCosmJsDecimal(result.rawReceiving),
      minimumReceiving: toCosmJsDecimal(result.minimumReceiving),
      liquidityProviderFee: toCosmJsDecimal(result.liquidityProviderFee),
      priceImpact: result.priceImpact.toNumber(),
    };
  }

  async #forceGetTokenRegistryEntry(denom: string) {
    const tokenRegistryEntries = await this.forceGetQueryClient().tokenRegistry.entries({});

    const registry = tokenRegistryEntries.registry?.entries.find((x) => x.denom === denom || x.baseDenom === denom);

    if (registry === undefined) {
      throw new Error("Coin not in token registry");
    }

    return registry;
  }

  // TODO: only keep sifBridge check once we migrated to Peggy2
  #isBridgedEthCoin(coin: Coin) {
    return (
      coin.denom !== NATIVE_ASSET_DENOM &&
      !coin.denom.startsWith("ibc/") &&
      (coin.denom.startsWith("c") || coin.denom.startsWith("sifBridge"))
    );
  }

  #isNativeCoin(coin: Coin | string) {
    return typeof coin === "string" ? coin === NATIVE_ASSET_DENOM : coin.denom === NATIVE_ASSET_DENOM;
  }
}
