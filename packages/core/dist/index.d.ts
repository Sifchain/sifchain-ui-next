import JSBI from 'jsbi';
import { ChainInfo } from '@keplr-wallet/types';
export { DeliverTxResponse } from '@cosmjs/stargate';

declare type Address = string;

declare type BigintIsh = JSBI | bigint | string;
declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
interface IFraction {
    readonly quotient: JSBI;
    readonly remainder: IFraction;
    readonly numerator: JSBI;
    readonly denominator: JSBI;
    invert(): IFraction;
    add(other: IFraction | BigintIsh): IFraction;
    subtract(other: IFraction | BigintIsh): IFraction;
    lessThan(other: IFraction | BigintIsh): boolean;
    lessThanOrEqual(other: IFraction | BigintIsh): boolean;
    equalTo(other: IFraction | BigintIsh): boolean;
    greaterThan(other: IFraction | BigintIsh): boolean;
    greaterThanOrEqual(other: IFraction | BigintIsh): boolean;
    multiply(other: IFraction | BigintIsh): IFraction;
    divide(other: IFraction | BigintIsh): IFraction;
    toSignificant(significantDigits: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces: number, format?: object, rounding?: Rounding): string;
}

declare type IAmount = {
    toBigInt(): JSBI;
    toString(detailed?: boolean): string;
    toNumber(): number;
    add(other: IAmount | string | number): IAmount;
    divide(other: IAmount | string | number): IAmount;
    equalTo(other: IAmount | string | number): boolean;
    greaterThan(other: IAmount | string | number): boolean;
    greaterThanOrEqual(other: IAmount | string | number): boolean;
    lessThan(other: IAmount | string | number): boolean;
    lessThanOrEqual(other: IAmount | string | number): boolean;
    multiply(other: IAmount | string | number): IAmount;
    sqrt(): IAmount;
    subtract(other: IAmount | string | number): IAmount;
};
declare function Amount(source: JSBI | bigint | string | IAmount | number): Readonly<IAmount>;
declare function isAmount(a: any): a is IAmount;
declare type _ExposeInternal<T extends IAmount> = T & {
    _toInternal(): IFraction;
    _fromInternal(fraction: IFraction): IAmount;
};

declare type NetworkKind = "sifchain" | "ethereum" | "akash" | "band" | "cosmoshub" | "crypto-org" | "iris" | "ixo" | "juno" | "likecoin" | "osmosis" | "persistence" | "regen" | "sentinel" | "terra" | "emoney" | "evmos" | "starname" | "bitsong" | "cerberus" | "comdex" | "chihuahua" | "ki" | "stargaze" | "secret";
declare const ACTIVE_NETWORKS: Set<NetworkKind>;

declare type IAsset = {
    address?: string;
    decimals: number;
    imageUrl?: string;
    name: string;
    network: NetworkKind;
    symbol: string;
    unitDenom?: string;
    ibcDenom?: string;
    displaySymbol: string;
    lowercasePrefixLength?: number;
    label?: string;
    hasDarkIcon?: boolean;
    homeNetwork: NetworkKind;
    decommissioned?: boolean;
    decommissionReason?: string;
};
declare type ReadonlyAsset = Readonly<IAsset>;
/**
 * @deprecated should only use as factory and not as throwable cache lookup
 */
declare function _Asset(symbol: string): ReadonlyAsset;
declare function _Asset(asset: IAsset): ReadonlyAsset;
declare function _Asset(assetOrSymbol: IAsset | string): ReadonlyAsset;
declare const Asset: typeof _Asset & {
    /**
     * @deprecated caching should happen at network layer
     */
    set: (symbol: string, asset: IAsset) => void;
    /**
     * A quick way to look up an asset by symbol.
     * Pass in a string, and it will attempt to look up the asset and return it. Throws an error if the asset is not found.
     *
     * Pass in an IAsset, and it will save it for future lookups.
     *
     * @remarks This lookup is only a shortcut and does not allow you to lookup an asset by chain. For that, use Chain#lookupAsset.
     * @deprecated should only use as factory and not as throwable cache lookup
     */
    get: (symbol: string) => Readonly<IAsset>;
};

declare type IAssetAmount = Readonly<IAsset> & {
    readonly asset: IAsset;
    readonly amount: IAmount;
    toBigInt(): JSBI;
    toString(detailed?: boolean): string;
    toNumber(): number;
    /**
     * @returns IAmount
     *
     * Return the derived value for the AssetAmount based on the asset's decimals
     *
     * @example
     * Lets say we have one eth:
     *
     * AssetAmount("eth", "100000000000000000").toDerived().equalTo(Amount("1")); // true
     * AssetAmount("usdc", "1000000").toDerived().equalTo(Amount("1")); // true
     *
     * All Math operators on AssetAmounts work on BaseUnits and return Amount objects. We have explored
     * creating a scheme for allowing mathematical operations to combine AssetAmounts but it is not clear as to
     * how to combine assets and which asset gets precedence. These rules would need to be internalized
     * by the team which may not be intuitive. Also performing mathematical operations on differing currencies
     * doesn't make conceptual sense.
     *
     *   Eg. What is 1 USDC x 1 ETH?
     *       - is it a value in ETH?
     *       - is it a value in USDC?
     *       - Mathematically it would be an ETHUSDC but we have no concept of this in our systems nor do we need one
     *
     * Instead when mixing AssetAmounts it is recommended to first extract the derived amounts and perform calculations on those
     *
     *   Eg.
     *   const ethAmount = oneEth.toDerived();
     *   const usdcAmount = oneUsdc.toDerived();
     *   const newAmount = ethAmount.multiply(usdcAmount);
     *   const newUsdcAmount = AssetAmount('usdc', newAmount);
     */
    toDerived(): IAmount;
    add(other: IAmount | string | number): IAmount;
    divide(other: IAmount | string | number): IAmount;
    equalTo(other: IAmount | string | number): boolean;
    greaterThan(other: IAmount | string | number): boolean;
    greaterThanOrEqual(other: IAmount | string | number): boolean;
    lessThan(other: IAmount | string | number): boolean;
    lessThanOrEqual(other: IAmount | string | number): boolean;
    multiply(other: IAmount | string | number): IAmount;
    sqrt(): IAmount;
    subtract(other: IAmount | string | number): IAmount;
};
declare function AssetAmount(asset: IAsset | string, amount: IAmount | string): IAssetAmount;
declare function isAssetAmount(value: any): value is IAssetAmount;

declare type BaseChainConfig = {
    network: NetworkKind;
    hidden?: boolean;
    chainId: string;
    displayName: string;
    blockExplorerUrl: string;
    nativeAssetSymbol: string;
    underMaintenance?: boolean;
};
declare type EthChainConfig = BaseChainConfig & {
    chainType: "eth";
    blockExplorerApiUrl: string;
};
declare type IBCChainConfig = BaseChainConfig & {
    chainType: "ibc";
    rpcUrl: string;
    restUrl: string;
    keplrChainInfo: ChainInfo;
    denomTracesPath?: string;
    features?: {
        erc20Transfers: boolean;
    };
};
declare type ChainConfig = IBCChainConfig | EthChainConfig;
declare type NetworkChainConfigLookup = Record<NetworkKind, ChainConfig>;
interface Chain {
    chainConfig: ChainConfig;
    network: NetworkKind;
    displayName: string;
    nativeAsset: IAsset;
    assets: IAsset[];
    assetMap: Map<string, IAsset>;
    forceGetAsset: (symbol: string) => IAsset;
    lookupAsset(symbol: string): IAsset | undefined;
    lookupAssetOrThrow(symbol: string): IAsset;
    findAssetWithLikeSymbol(symbol: string): IAsset | undefined;
    findAssetWithLikeSymbolOrThrow(symbol: string): IAsset;
    getBlockExplorerUrlForTxHash(hash: string): string;
    getBlockExplorerUrlForAddress(hash: string): string;
}

declare class LiquidityProvider {
    asset: IAsset;
    units: IAmount;
    address: string;
    nativeAmount: IAmount;
    externalAmount: IAmount;
    constructor(asset: IAsset, units: IAmount, address: string, nativeAmount: IAmount, externalAmount: IAmount);
}

declare class Pair {
    private nativeAsset;
    private externalAsset;
    amounts: [IAssetAmount, IAssetAmount];
    constructor(nativeAsset: IAssetAmount, externalAsset: IAssetAmount);
    otherAsset(asset: IAsset): IAssetAmount;
    symbol(): string;
    contains(...assets: IAsset[]): boolean;
    getAmount(asset: IAsset | string): IAssetAmount;
    toString(): string;
}

declare type IPool = Omit<Pool, "poolUnits" | "calculatePoolUnits">;
declare function getNormalizedSwapPrice(swapAsset: IAsset, pool: IPool): IAmount;
declare function calculateSwapResultPmtp(inputAmount: IAssetAmount, pool: IPool): IAmount;
declare type SwapPrices = {
    native: IAmount;
    external: IAmount;
};
declare class Pool extends Pair {
    poolUnits: IAmount;
    swapPrices?: SwapPrices;
    constructor(a: IAssetAmount, b: IAssetAmount, poolUnits?: IAmount, swapPrices?: SwapPrices);
    get nativeSwapPrice(): IAmount | undefined;
    get externalSwapPrice(): IAmount | undefined;
    get externalAmount(): IAssetAmount;
    get nativeAmount(): IAssetAmount;
    calcProviderFee(x: IAssetAmount): IAssetAmount;
    calcPriceImpact(x: IAssetAmount): IAmount;
    calcSwapResult(x: IAssetAmount): IAssetAmount;
    calcReverseSwapResult(Sa: IAssetAmount): IAssetAmount;
    calculatePoolUnits(nativeAssetAmount: IAssetAmount, externalAssetAmount: IAssetAmount): IAmount[];
}
declare function CompositePool(pair1: IPool, pair2: IPool): IPool;

declare type TransactionStatus = {
    code?: number;
    hash: string;
    state: "requested" | "accepted" | "failed" | "rejected" | "out_of_gas" | "completed";
    memo?: string;
    symbol?: string;
};
declare type TxHash = string;

declare enum WalletType {
    KEPLR = "keplr",
    METAMASK = "metamask"
}
interface Wallet {
    type: WalletType;
    displayName: string;
    iconSrc: string;
    loadForChain(chain: Chain): Promise<WalletConnection>;
}
declare type WalletConnection = {
    address: string;
    balances: IAssetAmount[];
    connected: boolean;
};
declare type Mnemonic = string;

declare enum ErrorCode {
    TX_FAILED_SLIPPAGE = 0,
    TX_FAILED = 1,
    USER_REJECTED = 2,
    UNKNOWN_FAILURE = 3,
    INSUFFICIENT_FUNDS = 4,
    TX_FAILED_OUT_OF_GAS = 5,
    TX_FAILED_NOT_ENOUGH_ROWAN_TO_COVER_GAS = 6,
    TX_FAILED_USER_NOT_ENOUGH_BALANCE = 7
}
declare function getErrorMessage(code: ErrorCode): string;

declare type IFormatOptionsBase = {
    exponent?: number;
    forceSign?: boolean;
    mode?: "number" | "percent";
    separator?: boolean;
    space?: boolean;
    prefix?: string;
    postfix?: string;
    zeroFormat?: string;
};
declare type IFormatOptionsMantissa<M = number | DynamicMantissa> = IFormatOptionsBase & {
    shorthand?: boolean;
    mantissa?: M;
    trimMantissa?: boolean | "integer";
};
declare type IFormatOptionsShorthandTotalLength = IFormatOptionsBase & {
    shorthand: true;
    totalLength?: number;
};
declare type DynamicMantissa = Record<number | "infinity", number>;
declare type IFormatOptions = IFormatOptionsMantissa | IFormatOptionsShorthandTotalLength;
/**
 * Takes an amount and a dynamic mantissa hash and returns the mantisaa value to use
 * @param amount amount given to format function
 * @param hash dynamic value hash to calculate mantissa from
 * @returns number of mantissa to send to formatter
 */
declare function getMantissaFromDynamicMantissa(amount: IAmount, hash: DynamicMantissa): any;
declare function round(decimal: string, places: number): string;
declare type AmountNotAssetAmount<T extends IAmount> = T extends IAssetAmount ? never : T;
declare function formatAssetAmount(value: IAssetAmount): string;
declare function format<T extends IAmount>(amount: AmountNotAssetAmount<T>): string;
declare function format<T extends IAmount>(amount: AmountNotAssetAmount<T>, asset: Exclude<IAsset, IAssetAmount>): string;
declare function format<T extends IAmount>(amount: AmountNotAssetAmount<T>, options: IFormatOptions): string;
declare function format<T extends IAmount>(amount: AmountNotAssetAmount<T>, asset: Exclude<IAsset, IAssetAmount>, options: IFormatOptions): string;
declare function trimMantissa(decimal: string, integer?: boolean): string;

/**
 * Function to shift the magnitude of a string without using any Math libs
 * This helps us move between decimals and integers
 * @param decimal the decimal string
 * @param shift the shift in the decimal point required
 * @returns string decimal
 */
declare function decimalShift(decimal: string, shift: number): string;
/**
 * Utility for converting to the base units of an asset
 * @param decimal the decimal string
 * @param asset the asset we want to get the base unit amount for
 * @returns amount as a string
 */
declare function toBaseUnits(decimal: string, asset: IAsset): string;
/**
 * Utility for converting from the base units of an asset
 * @param integer the integer string
 * @param asset the asset we want to get the base unit amount for
 * @returns amount as a string
 */
declare function fromBaseUnits(integer: string, asset: IAsset): string;
/**
 * Remove the decimal component of a string representation of a decimal number
 * @param decimal decimal to floor
 * @returns string with everything before the decimal point
 */
declare function floorDecimal(decimal: string): string;
/**
 * Utility to get the length of the trimmed mantissa from the amount
 * @param amount an IAmount
 * @returns length of mantissa
 */
declare function getMantissaLength<T extends IAmount>(amount: AmountNotAssetAmount<T>): number;
declare function humanUnitsToAssetAmount(asset: IAsset, amount: string | number): IAssetAmount;

declare function createPoolKey(a: IAsset | string, b: IAsset | string): string;

declare function getMetamaskProvider(): void;
declare type KeplrChainConfig = {
    rest: string;
    rpc: string;
    chainId: string;
    chainName: string;
    stakeCurrency: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
    };
    bip44: {
        coinType: number;
    };
    bech32Config: {
        bech32PrefixAccAddr: string;
        bech32PrefixAccPub: string;
        bech32PrefixValAddr: string;
        bech32PrefixValPub: string;
        bech32PrefixConsAddr: string;
        bech32PrefixConsPub: string;
    };
    currencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
    }[];
    feeCurrencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
    }[];
    coinType: number;
    gasPriceStep: {
        low: number;
        average: number;
        high: number;
    };
};
declare type CoreConfig = {
    sifAddrPrefix: string;
    sifApiUrl: string;
    sifRpcUrl: string;
    sifChainId: string;
    cryptoeconomicsUrl: string;
    blockExplorerUrl: string;
    web3Provider: "metamask" | string;
    nativeAsset: string;
    bridgebankContractAddress: string;
    keplrChainConfig: KeplrChainConfig;
};
declare function parseConfig(config: CoreConfig, assets: IAsset[], chainConfigsByNetwork: NetworkChainConfigLookup, peggyCompatibleCosmosBaseDenoms: Set<string>): {
    peggyCompatibleCosmosBaseDenoms: Set<string>;
    chains: never[];
    chainConfigsByNetwork: NetworkChainConfigLookup;
    sifAddrPrefix: string;
    sifApiUrl: string;
    sifRpcUrl: string;
    sifChainId: string;
    cryptoeconomicsUrl: string;
    blockExplorerUrl: string;
    getWeb3Provider: typeof getMetamaskProvider;
    assets: IAsset[];
    nativeAsset: IAsset;
    bridgebankContractAddress: string;
    bridgetokenContractAddress: string;
    keplrChainConfig: {
        rest: string;
        rpc: string;
        chainId: string;
        currencies: {
            coinDenom: string;
            coinDecimals: number;
            coinMinimalDenom: string;
        }[];
        chainName: string;
        stakeCurrency: {
            coinDenom: string;
            coinMinimalDenom: string;
            coinDecimals: number;
        };
        bip44: {
            coinType: number;
        };
        bech32Config: {
            bech32PrefixAccAddr: string;
            bech32PrefixAccPub: string;
            bech32PrefixValAddr: string;
            bech32PrefixValPub: string;
            bech32PrefixConsAddr: string;
            bech32PrefixConsPub: string;
        };
        feeCurrencies: {
            coinDenom: string;
            coinMinimalDenom: string;
            coinDecimals: number;
        }[];
        coinType: number;
        gasPriceStep: {
            low: number;
            average: number;
            high: number;
        };
    };
};

declare type NetworkEnv = "localnet" | "devnet" | "testnet" | "mainnet";

declare type ChainNetwork = `${NetworkKind}.${NetworkEnv}`;
declare type AppConfig = ReturnType<typeof parseConfig>;
declare function getConfig(applicationNetworkEnv?: NetworkEnv, sifchainAssetTag?: ChainNetwork, ethereumAssetTag?: ChainNetwork): AppConfig;

export { ACTIVE_NETWORKS, Address, Amount, AmountNotAssetAmount, AppConfig, Asset, AssetAmount, BaseChainConfig, Chain, ChainConfig, CompositePool, DynamicMantissa, ErrorCode, EthChainConfig, IAmount, IAsset, IAssetAmount, IBCChainConfig, IFormatOptions, IPool, LiquidityProvider, Mnemonic, NetworkChainConfigLookup, NetworkKind, Pair, Pool, SwapPrices, TransactionStatus, TxHash, Wallet, WalletConnection, WalletType, _ExposeInternal, calculateSwapResultPmtp, createPoolKey, decimalShift, floorDecimal, format, formatAssetAmount, fromBaseUnits, getConfig, getErrorMessage, getMantissaFromDynamicMantissa, getMantissaLength, getNormalizedSwapPrice, humanUnitsToAssetAmount, isAmount, isAssetAmount, round, toBaseUnits, trimMantissa };
