import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";
export interface BridgeBankInterface extends utils.Interface {
  functions: {
    "addExistingBridgeToken(address)": FunctionFragment;
    "addPauser(address)": FunctionFragment;
    "blocklist()": FunctionFragment;
    "bridgeTokenCount()": FunctionFragment;
    "bulkWhitelistUpdateLimits(address[])": FunctionFragment;
    "burn(bytes,address,uint256)": FunctionFragment;
    "changeOperator(address)": FunctionFragment;
    "changeOwner(address)": FunctionFragment;
    "cosmosBridge()": FunctionFragment;
    "cosmosDepositNonce()": FunctionFragment;
    "createNewBridgeToken(string)": FunctionFragment;
    "getBridgeToken(string)": FunctionFragment;
    "getCosmosTokenInWhiteList(address)": FunctionFragment;
    "getLockedFunds(string)": FunctionFragment;
    "getLockedTokenAddress(string)": FunctionFragment;
    "getTokenInEthWhiteList(address)": FunctionFragment;
    "hasBlocklist()": FunctionFragment;
    "initialize()": FunctionFragment;
    "initialize(address,address,address,address)": FunctionFragment;
    "lock(bytes,address,uint256)": FunctionFragment;
    "lockBurnNonce()": FunctionFragment;
    "lockedFunds(address)": FunctionFragment;
    "lockedTokenList(string)": FunctionFragment;
    "lowerToUpperTokens(string)": FunctionFragment;
    "maxTokenAmount(string)": FunctionFragment;
    "mintBridgeTokens(address,string,uint256)": FunctionFragment;
    "operator()": FunctionFragment;
    "oracle()": FunctionFragment;
    "owner()": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "pausers(address)": FunctionFragment;
    "renouncePauser()": FunctionFragment;
    "safeLowerToUpperTokens(string)": FunctionFragment;
    "setBlocklist(address)": FunctionFragment;
    "toLower(string)": FunctionFragment;
    "tokenFallback(address,uint256,bytes)": FunctionFragment;
    "unlock(address,string,uint256)": FunctionFragment;
    "unpause()": FunctionFragment;
    "updateEthWhiteList(address,bool)": FunctionFragment;
    "verifySifPrefix(bytes)": FunctionFragment;
  };
  getFunction(
    nameOrSignatureOrTopic:
      | "addExistingBridgeToken"
      | "addPauser"
      | "blocklist"
      | "bridgeTokenCount"
      | "bulkWhitelistUpdateLimits"
      | "burn"
      | "changeOperator"
      | "changeOwner"
      | "cosmosBridge"
      | "cosmosDepositNonce"
      | "createNewBridgeToken"
      | "getBridgeToken"
      | "getCosmosTokenInWhiteList"
      | "getLockedFunds"
      | "getLockedTokenAddress"
      | "getTokenInEthWhiteList"
      | "hasBlocklist"
      | "initialize()"
      | "initialize(address,address,address,address)"
      | "lock"
      | "lockBurnNonce"
      | "lockedFunds"
      | "lockedTokenList"
      | "lowerToUpperTokens"
      | "maxTokenAmount"
      | "mintBridgeTokens"
      | "operator"
      | "oracle"
      | "owner"
      | "pause"
      | "paused"
      | "pausers"
      | "renouncePauser"
      | "safeLowerToUpperTokens"
      | "setBlocklist"
      | "toLower"
      | "tokenFallback"
      | "unlock"
      | "unpause"
      | "updateEthWhiteList"
      | "verifySifPrefix",
  ): FunctionFragment;
  encodeFunctionData(
    functionFragment: "addExistingBridgeToken",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "addPauser",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(functionFragment: "blocklist", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "bridgeTokenCount",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "bulkWhitelistUpdateLimits",
    values: [PromiseOrValue<string>[]],
  ): string;
  encodeFunctionData(
    functionFragment: "burn",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
    ],
  ): string;
  encodeFunctionData(
    functionFragment: "changeOperator",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "changeOwner",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "cosmosBridge",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "cosmosDepositNonce",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "createNewBridgeToken",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "getBridgeToken",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "getCosmosTokenInWhiteList",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "getLockedFunds",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "getLockedTokenAddress",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenInEthWhiteList",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "hasBlocklist",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "initialize()",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "initialize(address,address,address,address)",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
    ],
  ): string;
  encodeFunctionData(
    functionFragment: "lock",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
    ],
  ): string;
  encodeFunctionData(
    functionFragment: "lockBurnNonce",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "lockedFunds",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "lockedTokenList",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "lowerToUpperTokens",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "maxTokenAmount",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "mintBridgeTokens",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
    ],
  ): string;
  encodeFunctionData(functionFragment: "operator", values?: undefined): string;
  encodeFunctionData(functionFragment: "oracle", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pausers",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "renouncePauser",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "safeLowerToUpperTokens",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "setBlocklist",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "toLower",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "tokenFallback",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
    ],
  ): string;
  encodeFunctionData(
    functionFragment: "unlock",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
    ],
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "updateEthWhiteList",
    values: [PromiseOrValue<string>, PromiseOrValue<boolean>],
  ): string;
  encodeFunctionData(
    functionFragment: "verifySifPrefix",
    values: [PromiseOrValue<BytesLike>],
  ): string;
  decodeFunctionResult(
    functionFragment: "addExistingBridgeToken",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "addPauser", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "blocklist", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "bridgeTokenCount",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "bulkWhitelistUpdateLimits",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "changeOperator",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeOwner",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "cosmosBridge",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "cosmosDepositNonce",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "createNewBridgeToken",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBridgeToken",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCosmosTokenInWhiteList",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLockedFunds",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLockedTokenAddress",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokenInEthWhiteList",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasBlocklist",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "initialize()",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "initialize(address,address,address,address)",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "lock", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lockBurnNonce",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "lockedFunds",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "lockedTokenList",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "lowerToUpperTokens",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxTokenAmount",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintBridgeTokens",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "operator", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "oracle", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pausers", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renouncePauser",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeLowerToUpperTokens",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "setBlocklist",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "toLower", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenFallback",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "unlock", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateEthWhiteList",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "verifySifPrefix",
    data: BytesLike,
  ): Result;
  events: {
    "LogBridgeTokenMint(address,string,uint256,address)": EventFragment;
    "LogBurn(address,bytes,address,string,uint256,uint256)": EventFragment;
    "LogLock(address,bytes,address,string,uint256,uint256)": EventFragment;
    "LogNewBridgeToken(address,string)": EventFragment;
    "LogUnlock(address,address,string,uint256)": EventFragment;
    "LogWhiteListUpdate(address,bool)": EventFragment;
    "Paused(address)": EventFragment;
    "Unpaused(address)": EventFragment;
  };
  getEvent(nameOrSignatureOrTopic: "LogBridgeTokenMint"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogBurn"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogLock"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogNewBridgeToken"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogUnlock"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogWhiteListUpdate"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
}
export interface LogBridgeTokenMintEventObject {
  _token: string;
  _symbol: string;
  _amount: BigNumber;
  _beneficiary: string;
}
export declare type LogBridgeTokenMintEvent = TypedEvent<
  [string, string, BigNumber, string],
  LogBridgeTokenMintEventObject
>;
export declare type LogBridgeTokenMintEventFilter =
  TypedEventFilter<LogBridgeTokenMintEvent>;
export interface LogBurnEventObject {
  _from: string;
  _to: string;
  _token: string;
  _symbol: string;
  _value: BigNumber;
  _nonce: BigNumber;
}
export declare type LogBurnEvent = TypedEvent<
  [string, string, string, string, BigNumber, BigNumber],
  LogBurnEventObject
>;
export declare type LogBurnEventFilter = TypedEventFilter<LogBurnEvent>;
export interface LogLockEventObject {
  _from: string;
  _to: string;
  _token: string;
  _symbol: string;
  _value: BigNumber;
  _nonce: BigNumber;
}
export declare type LogLockEvent = TypedEvent<
  [string, string, string, string, BigNumber, BigNumber],
  LogLockEventObject
>;
export declare type LogLockEventFilter = TypedEventFilter<LogLockEvent>;
export interface LogNewBridgeTokenEventObject {
  _token: string;
  _symbol: string;
}
export declare type LogNewBridgeTokenEvent = TypedEvent<
  [string, string],
  LogNewBridgeTokenEventObject
>;
export declare type LogNewBridgeTokenEventFilter =
  TypedEventFilter<LogNewBridgeTokenEvent>;
export interface LogUnlockEventObject {
  _to: string;
  _token: string;
  _symbol: string;
  _value: BigNumber;
}
export declare type LogUnlockEvent = TypedEvent<
  [string, string, string, BigNumber],
  LogUnlockEventObject
>;
export declare type LogUnlockEventFilter = TypedEventFilter<LogUnlockEvent>;
export interface LogWhiteListUpdateEventObject {
  _token: string;
  _value: boolean;
}
export declare type LogWhiteListUpdateEvent = TypedEvent<
  [string, boolean],
  LogWhiteListUpdateEventObject
>;
export declare type LogWhiteListUpdateEventFilter =
  TypedEventFilter<LogWhiteListUpdateEvent>;
export interface PausedEventObject {
  account: string;
}
export declare type PausedEvent = TypedEvent<[string], PausedEventObject>;
export declare type PausedEventFilter = TypedEventFilter<PausedEvent>;
export interface UnpausedEventObject {
  account: string;
}
export declare type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;
export declare type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;
export interface BridgeBank extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: BridgeBankInterface;
  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>;
  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>,
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>,
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;
  functions: {
    addExistingBridgeToken(
      _contractAddress: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    addPauser(
      account: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    blocklist(overrides?: CallOverrides): Promise<[string]>;
    bridgeTokenCount(overrides?: CallOverrides): Promise<[BigNumber]>;
    bulkWhitelistUpdateLimits(
      tokenAddresses: PromiseOrValue<string>[],
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    burn(
      _recipient: PromiseOrValue<BytesLike>,
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    changeOperator(
      _newOperator: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    changeOwner(
      _newOwner: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    cosmosBridge(overrides?: CallOverrides): Promise<[string]>;
    cosmosDepositNonce(overrides?: CallOverrides): Promise<[BigNumber]>;
    createNewBridgeToken(
      _symbol: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    getBridgeToken(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[string]>;
    getCosmosTokenInWhiteList(
      _token: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[boolean]>;
    getLockedFunds(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;
    getLockedTokenAddress(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[string]>;
    getTokenInEthWhiteList(
      _token: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[boolean]>;
    hasBlocklist(overrides?: CallOverrides): Promise<[boolean]>;
    "initialize()"(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    "initialize(address,address,address,address)"(
      _operatorAddress: PromiseOrValue<string>,
      _cosmosBridgeAddress: PromiseOrValue<string>,
      _owner: PromiseOrValue<string>,
      _pauser: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    lock(
      _recipient: PromiseOrValue<BytesLike>,
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    lockBurnNonce(overrides?: CallOverrides): Promise<[BigNumber]>;
    lockedFunds(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;
    lockedTokenList(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[string]>;
    lowerToUpperTokens(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[string]>;
    maxTokenAmount(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;
    mintBridgeTokens(
      _intendedRecipient: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    operator(overrides?: CallOverrides): Promise<[string]>;
    oracle(overrides?: CallOverrides): Promise<[string]>;
    owner(overrides?: CallOverrides): Promise<[string]>;
    pause(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    paused(overrides?: CallOverrides): Promise<[boolean]>;
    pausers(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[boolean]>;
    renouncePauser(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    safeLowerToUpperTokens(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[string]>;
    setBlocklist(
      blocklistAddress: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    toLower(
      str: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[string]>;
    tokenFallback(
      _from: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    unlock(
      _recipient: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    unpause(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    updateEthWhiteList(
      _token: PromiseOrValue<string>,
      _inList: PromiseOrValue<boolean>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<ContractTransaction>;
    verifySifPrefix(
      _sifAddress: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<[boolean]>;
  };
  addExistingBridgeToken(
    _contractAddress: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  addPauser(
    account: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  blocklist(overrides?: CallOverrides): Promise<string>;
  bridgeTokenCount(overrides?: CallOverrides): Promise<BigNumber>;
  bulkWhitelistUpdateLimits(
    tokenAddresses: PromiseOrValue<string>[],
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  burn(
    _recipient: PromiseOrValue<BytesLike>,
    _token: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  changeOperator(
    _newOperator: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  changeOwner(
    _newOwner: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  cosmosBridge(overrides?: CallOverrides): Promise<string>;
  cosmosDepositNonce(overrides?: CallOverrides): Promise<BigNumber>;
  createNewBridgeToken(
    _symbol: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  getBridgeToken(
    _symbol: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<string>;
  getCosmosTokenInWhiteList(
    _token: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<boolean>;
  getLockedFunds(
    _symbol: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;
  getLockedTokenAddress(
    _symbol: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<string>;
  getTokenInEthWhiteList(
    _token: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<boolean>;
  hasBlocklist(overrides?: CallOverrides): Promise<boolean>;
  "initialize()"(
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  "initialize(address,address,address,address)"(
    _operatorAddress: PromiseOrValue<string>,
    _cosmosBridgeAddress: PromiseOrValue<string>,
    _owner: PromiseOrValue<string>,
    _pauser: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  lock(
    _recipient: PromiseOrValue<BytesLike>,
    _token: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  lockBurnNonce(overrides?: CallOverrides): Promise<BigNumber>;
  lockedFunds(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;
  lockedTokenList(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<string>;
  lowerToUpperTokens(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<string>;
  maxTokenAmount(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;
  mintBridgeTokens(
    _intendedRecipient: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  operator(overrides?: CallOverrides): Promise<string>;
  oracle(overrides?: CallOverrides): Promise<string>;
  owner(overrides?: CallOverrides): Promise<string>;
  pause(
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  paused(overrides?: CallOverrides): Promise<boolean>;
  pausers(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<boolean>;
  renouncePauser(
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  safeLowerToUpperTokens(
    _symbol: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<string>;
  setBlocklist(
    blocklistAddress: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  toLower(
    str: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<string>;
  tokenFallback(
    _from: PromiseOrValue<string>,
    _value: PromiseOrValue<BigNumberish>,
    _data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  unlock(
    _recipient: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  unpause(
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  updateEthWhiteList(
    _token: PromiseOrValue<string>,
    _inList: PromiseOrValue<boolean>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    },
  ): Promise<ContractTransaction>;
  verifySifPrefix(
    _sifAddress: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides,
  ): Promise<boolean>;
  callStatic: {
    addExistingBridgeToken(
      _contractAddress: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<string>;
    addPauser(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;
    blocklist(overrides?: CallOverrides): Promise<string>;
    bridgeTokenCount(overrides?: CallOverrides): Promise<BigNumber>;
    bulkWhitelistUpdateLimits(
      tokenAddresses: PromiseOrValue<string>[],
      overrides?: CallOverrides,
    ): Promise<boolean>;
    burn(
      _recipient: PromiseOrValue<BytesLike>,
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;
    changeOperator(
      _newOperator: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;
    changeOwner(
      _newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;
    cosmosBridge(overrides?: CallOverrides): Promise<string>;
    cosmosDepositNonce(overrides?: CallOverrides): Promise<BigNumber>;
    createNewBridgeToken(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<string>;
    getBridgeToken(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<string>;
    getCosmosTokenInWhiteList(
      _token: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<boolean>;
    getLockedFunds(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    getLockedTokenAddress(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<string>;
    getTokenInEthWhiteList(
      _token: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<boolean>;
    hasBlocklist(overrides?: CallOverrides): Promise<boolean>;
    "initialize()"(overrides?: CallOverrides): Promise<void>;
    "initialize(address,address,address,address)"(
      _operatorAddress: PromiseOrValue<string>,
      _cosmosBridgeAddress: PromiseOrValue<string>,
      _owner: PromiseOrValue<string>,
      _pauser: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;
    lock(
      _recipient: PromiseOrValue<BytesLike>,
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;
    lockBurnNonce(overrides?: CallOverrides): Promise<BigNumber>;
    lockedFunds(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    lockedTokenList(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<string>;
    lowerToUpperTokens(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<string>;
    maxTokenAmount(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    mintBridgeTokens(
      _intendedRecipient: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;
    operator(overrides?: CallOverrides): Promise<string>;
    oracle(overrides?: CallOverrides): Promise<string>;
    owner(overrides?: CallOverrides): Promise<string>;
    pause(overrides?: CallOverrides): Promise<void>;
    paused(overrides?: CallOverrides): Promise<boolean>;
    pausers(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<boolean>;
    renouncePauser(overrides?: CallOverrides): Promise<void>;
    safeLowerToUpperTokens(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<string>;
    setBlocklist(
      blocklistAddress: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;
    toLower(
      str: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<string>;
    tokenFallback(
      _from: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<void>;
    unlock(
      _recipient: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;
    unpause(overrides?: CallOverrides): Promise<void>;
    updateEthWhiteList(
      _token: PromiseOrValue<string>,
      _inList: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<boolean>;
    verifySifPrefix(
      _sifAddress: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<boolean>;
  };
  filters: {
    "LogBridgeTokenMint(address,string,uint256,address)"(
      _token?: null,
      _symbol?: null,
      _amount?: null,
      _beneficiary?: null,
    ): LogBridgeTokenMintEventFilter;
    LogBridgeTokenMint(
      _token?: null,
      _symbol?: null,
      _amount?: null,
      _beneficiary?: null,
    ): LogBridgeTokenMintEventFilter;
    "LogBurn(address,bytes,address,string,uint256,uint256)"(
      _from?: null,
      _to?: null,
      _token?: null,
      _symbol?: null,
      _value?: null,
      _nonce?: null,
    ): LogBurnEventFilter;
    LogBurn(
      _from?: null,
      _to?: null,
      _token?: null,
      _symbol?: null,
      _value?: null,
      _nonce?: null,
    ): LogBurnEventFilter;
    "LogLock(address,bytes,address,string,uint256,uint256)"(
      _from?: null,
      _to?: null,
      _token?: null,
      _symbol?: null,
      _value?: null,
      _nonce?: null,
    ): LogLockEventFilter;
    LogLock(
      _from?: null,
      _to?: null,
      _token?: null,
      _symbol?: null,
      _value?: null,
      _nonce?: null,
    ): LogLockEventFilter;
    "LogNewBridgeToken(address,string)"(
      _token?: null,
      _symbol?: null,
    ): LogNewBridgeTokenEventFilter;
    LogNewBridgeToken(
      _token?: null,
      _symbol?: null,
    ): LogNewBridgeTokenEventFilter;
    "LogUnlock(address,address,string,uint256)"(
      _to?: null,
      _token?: null,
      _symbol?: null,
      _value?: null,
    ): LogUnlockEventFilter;
    LogUnlock(
      _to?: null,
      _token?: null,
      _symbol?: null,
      _value?: null,
    ): LogUnlockEventFilter;
    "LogWhiteListUpdate(address,bool)"(
      _token?: null,
      _value?: null,
    ): LogWhiteListUpdateEventFilter;
    LogWhiteListUpdate(
      _token?: null,
      _value?: null,
    ): LogWhiteListUpdateEventFilter;
    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;
    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;
  };
  estimateGas: {
    addExistingBridgeToken(
      _contractAddress: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    addPauser(
      account: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    blocklist(overrides?: CallOverrides): Promise<BigNumber>;
    bridgeTokenCount(overrides?: CallOverrides): Promise<BigNumber>;
    bulkWhitelistUpdateLimits(
      tokenAddresses: PromiseOrValue<string>[],
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    burn(
      _recipient: PromiseOrValue<BytesLike>,
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    changeOperator(
      _newOperator: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    changeOwner(
      _newOwner: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    cosmosBridge(overrides?: CallOverrides): Promise<BigNumber>;
    cosmosDepositNonce(overrides?: CallOverrides): Promise<BigNumber>;
    createNewBridgeToken(
      _symbol: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    getBridgeToken(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    getCosmosTokenInWhiteList(
      _token: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    getLockedFunds(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    getLockedTokenAddress(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    getTokenInEthWhiteList(
      _token: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    hasBlocklist(overrides?: CallOverrides): Promise<BigNumber>;
    "initialize()"(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    "initialize(address,address,address,address)"(
      _operatorAddress: PromiseOrValue<string>,
      _cosmosBridgeAddress: PromiseOrValue<string>,
      _owner: PromiseOrValue<string>,
      _pauser: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    lock(
      _recipient: PromiseOrValue<BytesLike>,
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    lockBurnNonce(overrides?: CallOverrides): Promise<BigNumber>;
    lockedFunds(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    lockedTokenList(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    lowerToUpperTokens(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    maxTokenAmount(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    mintBridgeTokens(
      _intendedRecipient: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    operator(overrides?: CallOverrides): Promise<BigNumber>;
    oracle(overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<BigNumber>;
    pause(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    paused(overrides?: CallOverrides): Promise<BigNumber>;
    pausers(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    renouncePauser(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    safeLowerToUpperTokens(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    setBlocklist(
      blocklistAddress: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    toLower(
      str: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
    tokenFallback(
      _from: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    unlock(
      _recipient: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    unpause(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    updateEthWhiteList(
      _token: PromiseOrValue<string>,
      _inList: PromiseOrValue<boolean>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<BigNumber>;
    verifySifPrefix(
      _sifAddress: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    addExistingBridgeToken(
      _contractAddress: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    addPauser(
      account: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    blocklist(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    bridgeTokenCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    bulkWhitelistUpdateLimits(
      tokenAddresses: PromiseOrValue<string>[],
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    burn(
      _recipient: PromiseOrValue<BytesLike>,
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    changeOperator(
      _newOperator: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    changeOwner(
      _newOwner: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    cosmosBridge(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    cosmosDepositNonce(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    createNewBridgeToken(
      _symbol: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    getBridgeToken(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    getCosmosTokenInWhiteList(
      _token: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    getLockedFunds(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    getLockedTokenAddress(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    getTokenInEthWhiteList(
      _token: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    hasBlocklist(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    "initialize()"(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    "initialize(address,address,address,address)"(
      _operatorAddress: PromiseOrValue<string>,
      _cosmosBridgeAddress: PromiseOrValue<string>,
      _owner: PromiseOrValue<string>,
      _pauser: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    lock(
      _recipient: PromiseOrValue<BytesLike>,
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    lockBurnNonce(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    lockedFunds(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    lockedTokenList(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    lowerToUpperTokens(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    maxTokenAmount(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    mintBridgeTokens(
      _intendedRecipient: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    operator(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    oracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    pause(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    pausers(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    renouncePauser(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    safeLowerToUpperTokens(
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    setBlocklist(
      blocklistAddress: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    toLower(
      str: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
    tokenFallback(
      _from: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    unlock(
      _recipient: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    unpause(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    updateEthWhiteList(
      _token: PromiseOrValue<string>,
      _inList: PromiseOrValue<boolean>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      },
    ): Promise<PopulatedTransaction>;
    verifySifPrefix(
      _sifAddress: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}
