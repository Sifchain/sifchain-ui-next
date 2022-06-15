import { Decimal } from "@cosmjs/math";
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
  calculateLiquidityProviderFee,
  calculatePriceImpact,
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

    this.#sifQueryClient =
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
    return this.#sifQueryClient;
  }

  protected override forceGetQueryClient() {
    if (this.#sifQueryClient === undefined) {
      throw new Error(
        "Query client not available. You cannot use online functionality in offline mode.",
      );
    }

    return this.#sifQueryClient;
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
    const registry = await this.#forceGetTokenRegistryEntry(
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
    const registry = await this.#forceGetTokenRegistryEntry(
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
          typeUrl: this.#isBridgedEthCoin(transferAmount)
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
  ) {
    const result = this.#simulateAutoCompositePoolSwap(
      fromCoin,
      toCoin,
      pmtpBlockRate,
      slippage,
    );
    return {
      rawReceiving: result.rawReceiving.integerValue().toString(),
      minimumReceiving: result.minimumReceiving.integerValue().toString(),
      liquidityProvidierFee: result.liquidityProvidierFee
        .integerValue()
        .toString(),
      priceImpact: result.priceImpact.toNumber(),
    };
  }

  /**
   * asynchronous method for simulating swap
   * if lots of swap simulations are required, use {@link simulateSwapSync} instead
   * @param fromCoin
   * @param toCoinDenom
   * @param slippage value between 0 and 1
   * @returns
   */
  async simulateSwap(
    fromCoin: Coin,
    toCoin: Omit<Coin, "amount">,
    slippage?: number | string,
  ) {
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

    const pmtpParamsRes = await queryClient.clp.getPmtpParams({});

    return this.#parseSwapResult(
      this.#simulateAutoCompositePoolSwap(
        {
          ...fromCoin,
          poolNativeAssetBalance: firstPoolRes.pool?.nativeAssetBalance ?? "0",
          poolExternalAssetBalance:
            firstPoolRes.pool?.externalAssetBalance ?? "0",
        },
        {
          ...toCoin,
          poolNativeAssetBalance: secondPoolRes.pool?.nativeAssetBalance ?? "0",
          poolExternalAssetBalance:
            secondPoolRes.pool?.externalAssetBalance ?? "0",
        },
        pmtpParamsRes.pmtpRateParams?.pmtpPeriodBlockRate,
        slippage,
      ),
      toCoin.denom,
    );
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
        },
        { poolBalance: toCoin.poolExternalAssetBalance },
        pmtpBlockRate,
        slippage,
      );
    }

    // coin -> rowan
    if (this.#isNativeCoin(toCoin.denom)) {
      return this.#simulateSwap(
        {
          amount: fromCoin.amount,
          poolBalance: fromCoin.poolExternalAssetBalance,
        },
        { poolBalance: toCoin.poolNativeAssetBalance },
        pmtpBlockRate,
        slippage,
      );
    }

    // if neither coins is rowan then we need to do coin1 -> rowan -> coin2
    const firstSwap = this.#simulateSwap(
      {
        amount: fromCoin.amount,
        poolBalance: fromCoin.poolExternalAssetBalance,
      },
      { poolBalance: fromCoin.poolNativeAssetBalance },
      pmtpBlockRate,
    );

    const firstSwapConvertedLpFee = this.#simulateSwap(
      {
        amount: firstSwap.liquidityProvidierFee.toString(),
        poolBalance: toCoin.poolNativeAssetBalance,
      },
      { poolBalance: toCoin.poolExternalAssetBalance },
    );

    const secondSwap = this.#simulateSwap(
      {
        amount: firstSwap.rawReceiving.toString(),
        poolBalance: toCoin.poolNativeAssetBalance,
      },
      { poolBalance: toCoin.poolExternalAssetBalance },
      pmtpBlockRate,
      slippage,
    );

    return {
      ...secondSwap,
      priceImpact: firstSwap.priceImpact.plus(secondSwap.priceImpact),
      liquidityProvidierFee: firstSwapConvertedLpFee.rawReceiving.plus(
        secondSwap.liquidityProvidierFee,
      ),
    };
  }

  #simulateSwap(
    fromCoin: { amount: string; poolBalance: string },
    toCoin: { poolBalance: string },
    pmtpBlockRate?: string,
    slippage?: number | string,
  ) {
    const swapResult = calculateSwapResult(
      fromCoin.amount,
      fromCoin.poolBalance,
      toCoin.poolBalance,
      pmtpBlockRate,
    );

    const priceImpact = calculatePriceImpact(
      fromCoin.amount,
      fromCoin.poolBalance,
    );

    const liquidityProvidierFee = calculateLiquidityProviderFee(
      fromCoin.amount,
      fromCoin.poolBalance,
      toCoin.poolBalance,
    );

    return {
      rawReceiving: swapResult,
      minimumReceiving: swapResult
        .times(priceImpact.minus(1).abs())
        .minus(liquidityProvidierFee)
        .times(new BigNumber(1).minus(slippage ?? 0)),
      priceImpact,
      liquidityProvidierFee,
    };
  }

  /**
   * convert BigNumber to cosmjs Decimal to keep with cosmjs standard
   */
  async #parseSwapResult(
    result: {
      rawReceiving: BigNumber;
      minimumReceiving: BigNumber;
      priceImpact: BigNumber;
      liquidityProvidierFee: BigNumber;
    },
    toCoinDenom: string,
  ) {
    const queryClient = this.forceGetQueryClient();
    const tokenRegistryRes = await queryClient.tokenRegistry.entries({});
    const tokenRecord = tokenRegistryRes.registry?.entries.find(
      (x) => x.denom === toCoinDenom,
    );

    if (tokenRecord === undefined) {
      throw new Error(`No token record found for denom ${toCoinDenom}`);
    }

    const toCosmJsDecimal = (bn: BigNumber) =>
      Decimal.fromAtomics(
        bn.integerValue().toFixed(0).toString(),
        tokenRecord.decimals.toNumber(),
      );

    return {
      rawReceiving: toCosmJsDecimal(result.rawReceiving),
      minimumReceiving: toCosmJsDecimal(result.minimumReceiving),
      liquidityProvidierFee: toCosmJsDecimal(result.liquidityProvidierFee),
      priceImpact: result.priceImpact.toNumber(),
    };
  }

  async #forceGetTokenRegistryEntry(denom: string) {
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
  #isBridgedEthCoin(coin: Coin) {
    return (
      coin.denom !== "rowan" &&
      !coin.denom.startsWith("ibc/") &&
      (coin.denom.startsWith("c") || coin.denom.startsWith("sifBridge"))
    );
  }

  #isNativeCoin(coin: Coin | string) {
    return typeof coin === "string" ? coin === "rowan" : coin.denom === "rowan";
  }
}
