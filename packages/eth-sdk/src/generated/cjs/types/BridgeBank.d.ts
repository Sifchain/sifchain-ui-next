import { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface BridgeBankInterface extends utils.Interface {
    contractName: "BridgeBank";
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
    encodeFunctionData(functionFragment: "addExistingBridgeToken", values: [string]): string;
    encodeFunctionData(functionFragment: "addPauser", values: [string]): string;
    encodeFunctionData(functionFragment: "blocklist", values?: undefined): string;
    encodeFunctionData(functionFragment: "bridgeTokenCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "bulkWhitelistUpdateLimits", values: [string[]]): string;
    encodeFunctionData(functionFragment: "burn", values: [BytesLike, string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "changeOperator", values: [string]): string;
    encodeFunctionData(functionFragment: "changeOwner", values: [string]): string;
    encodeFunctionData(functionFragment: "cosmosBridge", values?: undefined): string;
    encodeFunctionData(functionFragment: "cosmosDepositNonce", values?: undefined): string;
    encodeFunctionData(functionFragment: "createNewBridgeToken", values: [string]): string;
    encodeFunctionData(functionFragment: "getBridgeToken", values: [string]): string;
    encodeFunctionData(functionFragment: "getCosmosTokenInWhiteList", values: [string]): string;
    encodeFunctionData(functionFragment: "getLockedFunds", values: [string]): string;
    encodeFunctionData(functionFragment: "getLockedTokenAddress", values: [string]): string;
    encodeFunctionData(functionFragment: "getTokenInEthWhiteList", values: [string]): string;
    encodeFunctionData(functionFragment: "hasBlocklist", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values?: undefined): string;
    encodeFunctionData(functionFragment: "lock", values: [BytesLike, string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "lockBurnNonce", values?: undefined): string;
    encodeFunctionData(functionFragment: "lockedFunds", values: [string]): string;
    encodeFunctionData(functionFragment: "lockedTokenList", values: [string]): string;
    encodeFunctionData(functionFragment: "lowerToUpperTokens", values: [string]): string;
    encodeFunctionData(functionFragment: "maxTokenAmount", values: [string]): string;
    encodeFunctionData(functionFragment: "mintBridgeTokens", values: [string, string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "operator", values?: undefined): string;
    encodeFunctionData(functionFragment: "oracle", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "pause", values?: undefined): string;
    encodeFunctionData(functionFragment: "paused", values?: undefined): string;
    encodeFunctionData(functionFragment: "pausers", values: [string]): string;
    encodeFunctionData(functionFragment: "renouncePauser", values?: undefined): string;
    encodeFunctionData(functionFragment: "safeLowerToUpperTokens", values: [string]): string;
    encodeFunctionData(functionFragment: "setBlocklist", values: [string]): string;
    encodeFunctionData(functionFragment: "toLower", values: [string]): string;
    encodeFunctionData(functionFragment: "tokenFallback", values: [string, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "unlock", values: [string, string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
    encodeFunctionData(functionFragment: "updateEthWhiteList", values: [string, boolean]): string;
    encodeFunctionData(functionFragment: "verifySifPrefix", values: [BytesLike]): string;
    decodeFunctionResult(functionFragment: "addExistingBridgeToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addPauser", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "blocklist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "bridgeTokenCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "bulkWhitelistUpdateLimits", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeOperator", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "cosmosBridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "cosmosDepositNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createNewBridgeToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBridgeToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCosmosTokenInWhiteList", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLockedFunds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLockedTokenAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTokenInEthWhiteList", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hasBlocklist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lock", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockBurnNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockedFunds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockedTokenList", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lowerToUpperTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxTokenAmount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mintBridgeTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "operator", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "oracle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pausers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renouncePauser", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeLowerToUpperTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setBlocklist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "toLower", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenFallback", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unlock", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateEthWhiteList", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifySifPrefix", data: BytesLike): Result;
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
export declare type LogBridgeTokenMintEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    string
], {
    _token: string;
    _symbol: string;
    _amount: BigNumber;
    _beneficiary: string;
}>;
export declare type LogBridgeTokenMintEventFilter = TypedEventFilter<LogBridgeTokenMintEvent>;
export declare type LogBurnEvent = TypedEvent<[
    string,
    string,
    string,
    string,
    BigNumber,
    BigNumber
], {
    _from: string;
    _to: string;
    _token: string;
    _symbol: string;
    _value: BigNumber;
    _nonce: BigNumber;
}>;
export declare type LogBurnEventFilter = TypedEventFilter<LogBurnEvent>;
export declare type LogLockEvent = TypedEvent<[
    string,
    string,
    string,
    string,
    BigNumber,
    BigNumber
], {
    _from: string;
    _to: string;
    _token: string;
    _symbol: string;
    _value: BigNumber;
    _nonce: BigNumber;
}>;
export declare type LogLockEventFilter = TypedEventFilter<LogLockEvent>;
export declare type LogNewBridgeTokenEvent = TypedEvent<[
    string,
    string
], {
    _token: string;
    _symbol: string;
}>;
export declare type LogNewBridgeTokenEventFilter = TypedEventFilter<LogNewBridgeTokenEvent>;
export declare type LogUnlockEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber
], {
    _to: string;
    _token: string;
    _symbol: string;
    _value: BigNumber;
}>;
export declare type LogUnlockEventFilter = TypedEventFilter<LogUnlockEvent>;
export declare type LogWhiteListUpdateEvent = TypedEvent<[
    string,
    boolean
], {
    _token: string;
    _value: boolean;
}>;
export declare type LogWhiteListUpdateEventFilter = TypedEventFilter<LogWhiteListUpdateEvent>;
export declare type PausedEvent = TypedEvent<[string], {
    account: string;
}>;
export declare type PausedEventFilter = TypedEventFilter<PausedEvent>;
export declare type UnpausedEvent = TypedEvent<[string], {
    account: string;
}>;
export declare type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;
export interface BridgeBank extends BaseContract {
    contractName: "BridgeBank";
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: BridgeBankInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        addExistingBridgeToken(_contractAddress: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        addPauser(account: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        blocklist(overrides?: CallOverrides): Promise<[string]>;
        bridgeTokenCount(overrides?: CallOverrides): Promise<[BigNumber]>;
        bulkWhitelistUpdateLimits(tokenAddresses: string[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        burn(_recipient: BytesLike, _token: string, _amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        changeOperator(_newOperator: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        changeOwner(_newOwner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        cosmosBridge(overrides?: CallOverrides): Promise<[string]>;
        cosmosDepositNonce(overrides?: CallOverrides): Promise<[BigNumber]>;
        createNewBridgeToken(_symbol: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        getBridgeToken(_symbol: string, overrides?: CallOverrides): Promise<[string]>;
        getCosmosTokenInWhiteList(_token: string, overrides?: CallOverrides): Promise<[boolean]>;
        getLockedFunds(_symbol: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        getLockedTokenAddress(_symbol: string, overrides?: CallOverrides): Promise<[string]>;
        getTokenInEthWhiteList(_token: string, overrides?: CallOverrides): Promise<[boolean]>;
        hasBlocklist(overrides?: CallOverrides): Promise<[boolean]>;
        "initialize()"(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        "initialize(address,address,address,address)"(_operatorAddress: string, _cosmosBridgeAddress: string, _owner: string, _pauser: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        lock(_recipient: BytesLike, _token: string, _amount: BigNumberish, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        lockBurnNonce(overrides?: CallOverrides): Promise<[BigNumber]>;
        lockedFunds(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        lockedTokenList(arg0: string, overrides?: CallOverrides): Promise<[string]>;
        lowerToUpperTokens(arg0: string, overrides?: CallOverrides): Promise<[string]>;
        maxTokenAmount(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        mintBridgeTokens(_intendedRecipient: string, _symbol: string, _amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        operator(overrides?: CallOverrides): Promise<[string]>;
        oracle(overrides?: CallOverrides): Promise<[string]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        pause(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        paused(overrides?: CallOverrides): Promise<[boolean]>;
        pausers(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;
        renouncePauser(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        safeLowerToUpperTokens(_symbol: string, overrides?: CallOverrides): Promise<[string]>;
        setBlocklist(blocklistAddress: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        toLower(str: string, overrides?: CallOverrides): Promise<[string]>;
        tokenFallback(_from: string, _value: BigNumberish, _data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        unlock(_recipient: string, _symbol: string, _amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        unpause(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        updateEthWhiteList(_token: string, _inList: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        verifySifPrefix(_sifAddress: BytesLike, overrides?: CallOverrides): Promise<[boolean]>;
    };
    addExistingBridgeToken(_contractAddress: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    addPauser(account: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    blocklist(overrides?: CallOverrides): Promise<string>;
    bridgeTokenCount(overrides?: CallOverrides): Promise<BigNumber>;
    bulkWhitelistUpdateLimits(tokenAddresses: string[], overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    burn(_recipient: BytesLike, _token: string, _amount: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    changeOperator(_newOperator: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    changeOwner(_newOwner: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    cosmosBridge(overrides?: CallOverrides): Promise<string>;
    cosmosDepositNonce(overrides?: CallOverrides): Promise<BigNumber>;
    createNewBridgeToken(_symbol: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    getBridgeToken(_symbol: string, overrides?: CallOverrides): Promise<string>;
    getCosmosTokenInWhiteList(_token: string, overrides?: CallOverrides): Promise<boolean>;
    getLockedFunds(_symbol: string, overrides?: CallOverrides): Promise<BigNumber>;
    getLockedTokenAddress(_symbol: string, overrides?: CallOverrides): Promise<string>;
    getTokenInEthWhiteList(_token: string, overrides?: CallOverrides): Promise<boolean>;
    hasBlocklist(overrides?: CallOverrides): Promise<boolean>;
    "initialize()"(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    "initialize(address,address,address,address)"(_operatorAddress: string, _cosmosBridgeAddress: string, _owner: string, _pauser: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    lock(_recipient: BytesLike, _token: string, _amount: BigNumberish, overrides?: PayableOverrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    lockBurnNonce(overrides?: CallOverrides): Promise<BigNumber>;
    lockedFunds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    lockedTokenList(arg0: string, overrides?: CallOverrides): Promise<string>;
    lowerToUpperTokens(arg0: string, overrides?: CallOverrides): Promise<string>;
    maxTokenAmount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
    mintBridgeTokens(_intendedRecipient: string, _symbol: string, _amount: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    operator(overrides?: CallOverrides): Promise<string>;
    oracle(overrides?: CallOverrides): Promise<string>;
    owner(overrides?: CallOverrides): Promise<string>;
    pause(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    paused(overrides?: CallOverrides): Promise<boolean>;
    pausers(arg0: string, overrides?: CallOverrides): Promise<boolean>;
    renouncePauser(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    safeLowerToUpperTokens(_symbol: string, overrides?: CallOverrides): Promise<string>;
    setBlocklist(blocklistAddress: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    toLower(str: string, overrides?: CallOverrides): Promise<string>;
    tokenFallback(_from: string, _value: BigNumberish, _data: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    unlock(_recipient: string, _symbol: string, _amount: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    unpause(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    updateEthWhiteList(_token: string, _inList: boolean, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    verifySifPrefix(_sifAddress: BytesLike, overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        addExistingBridgeToken(_contractAddress: string, overrides?: CallOverrides): Promise<string>;
        addPauser(account: string, overrides?: CallOverrides): Promise<void>;
        blocklist(overrides?: CallOverrides): Promise<string>;
        bridgeTokenCount(overrides?: CallOverrides): Promise<BigNumber>;
        bulkWhitelistUpdateLimits(tokenAddresses: string[], overrides?: CallOverrides): Promise<boolean>;
        burn(_recipient: BytesLike, _token: string, _amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
        changeOperator(_newOperator: string, overrides?: CallOverrides): Promise<void>;
        changeOwner(_newOwner: string, overrides?: CallOverrides): Promise<void>;
        cosmosBridge(overrides?: CallOverrides): Promise<string>;
        cosmosDepositNonce(overrides?: CallOverrides): Promise<BigNumber>;
        createNewBridgeToken(_symbol: string, overrides?: CallOverrides): Promise<string>;
        getBridgeToken(_symbol: string, overrides?: CallOverrides): Promise<string>;
        getCosmosTokenInWhiteList(_token: string, overrides?: CallOverrides): Promise<boolean>;
        getLockedFunds(_symbol: string, overrides?: CallOverrides): Promise<BigNumber>;
        getLockedTokenAddress(_symbol: string, overrides?: CallOverrides): Promise<string>;
        getTokenInEthWhiteList(_token: string, overrides?: CallOverrides): Promise<boolean>;
        hasBlocklist(overrides?: CallOverrides): Promise<boolean>;
        "initialize()"(overrides?: CallOverrides): Promise<void>;
        "initialize(address,address,address,address)"(_operatorAddress: string, _cosmosBridgeAddress: string, _owner: string, _pauser: string, overrides?: CallOverrides): Promise<void>;
        lock(_recipient: BytesLike, _token: string, _amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
        lockBurnNonce(overrides?: CallOverrides): Promise<BigNumber>;
        lockedFunds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        lockedTokenList(arg0: string, overrides?: CallOverrides): Promise<string>;
        lowerToUpperTokens(arg0: string, overrides?: CallOverrides): Promise<string>;
        maxTokenAmount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        mintBridgeTokens(_intendedRecipient: string, _symbol: string, _amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
        operator(overrides?: CallOverrides): Promise<string>;
        oracle(overrides?: CallOverrides): Promise<string>;
        owner(overrides?: CallOverrides): Promise<string>;
        pause(overrides?: CallOverrides): Promise<void>;
        paused(overrides?: CallOverrides): Promise<boolean>;
        pausers(arg0: string, overrides?: CallOverrides): Promise<boolean>;
        renouncePauser(overrides?: CallOverrides): Promise<void>;
        safeLowerToUpperTokens(_symbol: string, overrides?: CallOverrides): Promise<string>;
        setBlocklist(blocklistAddress: string, overrides?: CallOverrides): Promise<void>;
        toLower(str: string, overrides?: CallOverrides): Promise<string>;
        tokenFallback(_from: string, _value: BigNumberish, _data: BytesLike, overrides?: CallOverrides): Promise<void>;
        unlock(_recipient: string, _symbol: string, _amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
        unpause(overrides?: CallOverrides): Promise<void>;
        updateEthWhiteList(_token: string, _inList: boolean, overrides?: CallOverrides): Promise<boolean>;
        verifySifPrefix(_sifAddress: BytesLike, overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {
        "LogBridgeTokenMint(address,string,uint256,address)"(_token?: null, _symbol?: null, _amount?: null, _beneficiary?: null): LogBridgeTokenMintEventFilter;
        LogBridgeTokenMint(_token?: null, _symbol?: null, _amount?: null, _beneficiary?: null): LogBridgeTokenMintEventFilter;
        "LogBurn(address,bytes,address,string,uint256,uint256)"(_from?: null, _to?: null, _token?: null, _symbol?: null, _value?: null, _nonce?: null): LogBurnEventFilter;
        LogBurn(_from?: null, _to?: null, _token?: null, _symbol?: null, _value?: null, _nonce?: null): LogBurnEventFilter;
        "LogLock(address,bytes,address,string,uint256,uint256)"(_from?: null, _to?: null, _token?: null, _symbol?: null, _value?: null, _nonce?: null): LogLockEventFilter;
        LogLock(_from?: null, _to?: null, _token?: null, _symbol?: null, _value?: null, _nonce?: null): LogLockEventFilter;
        "LogNewBridgeToken(address,string)"(_token?: null, _symbol?: null): LogNewBridgeTokenEventFilter;
        LogNewBridgeToken(_token?: null, _symbol?: null): LogNewBridgeTokenEventFilter;
        "LogUnlock(address,address,string,uint256)"(_to?: null, _token?: null, _symbol?: null, _value?: null): LogUnlockEventFilter;
        LogUnlock(_to?: null, _token?: null, _symbol?: null, _value?: null): LogUnlockEventFilter;
        "LogWhiteListUpdate(address,bool)"(_token?: null, _value?: null): LogWhiteListUpdateEventFilter;
        LogWhiteListUpdate(_token?: null, _value?: null): LogWhiteListUpdateEventFilter;
        "Paused(address)"(account?: null): PausedEventFilter;
        Paused(account?: null): PausedEventFilter;
        "Unpaused(address)"(account?: null): UnpausedEventFilter;
        Unpaused(account?: null): UnpausedEventFilter;
    };
    estimateGas: {
        addExistingBridgeToken(_contractAddress: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        addPauser(account: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        blocklist(overrides?: CallOverrides): Promise<BigNumber>;
        bridgeTokenCount(overrides?: CallOverrides): Promise<BigNumber>;
        bulkWhitelistUpdateLimits(tokenAddresses: string[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        burn(_recipient: BytesLike, _token: string, _amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        changeOperator(_newOperator: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        changeOwner(_newOwner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        cosmosBridge(overrides?: CallOverrides): Promise<BigNumber>;
        cosmosDepositNonce(overrides?: CallOverrides): Promise<BigNumber>;
        createNewBridgeToken(_symbol: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        getBridgeToken(_symbol: string, overrides?: CallOverrides): Promise<BigNumber>;
        getCosmosTokenInWhiteList(_token: string, overrides?: CallOverrides): Promise<BigNumber>;
        getLockedFunds(_symbol: string, overrides?: CallOverrides): Promise<BigNumber>;
        getLockedTokenAddress(_symbol: string, overrides?: CallOverrides): Promise<BigNumber>;
        getTokenInEthWhiteList(_token: string, overrides?: CallOverrides): Promise<BigNumber>;
        hasBlocklist(overrides?: CallOverrides): Promise<BigNumber>;
        "initialize()"(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        "initialize(address,address,address,address)"(_operatorAddress: string, _cosmosBridgeAddress: string, _owner: string, _pauser: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        lock(_recipient: BytesLike, _token: string, _amount: BigNumberish, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        lockBurnNonce(overrides?: CallOverrides): Promise<BigNumber>;
        lockedFunds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        lockedTokenList(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        lowerToUpperTokens(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        maxTokenAmount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        mintBridgeTokens(_intendedRecipient: string, _symbol: string, _amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        operator(overrides?: CallOverrides): Promise<BigNumber>;
        oracle(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        pause(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        paused(overrides?: CallOverrides): Promise<BigNumber>;
        pausers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        renouncePauser(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        safeLowerToUpperTokens(_symbol: string, overrides?: CallOverrides): Promise<BigNumber>;
        setBlocklist(blocklistAddress: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        toLower(str: string, overrides?: CallOverrides): Promise<BigNumber>;
        tokenFallback(_from: string, _value: BigNumberish, _data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        unlock(_recipient: string, _symbol: string, _amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        unpause(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        updateEthWhiteList(_token: string, _inList: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        verifySifPrefix(_sifAddress: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        addExistingBridgeToken(_contractAddress: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        addPauser(account: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        blocklist(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        bridgeTokenCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        bulkWhitelistUpdateLimits(tokenAddresses: string[], overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        burn(_recipient: BytesLike, _token: string, _amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        changeOperator(_newOperator: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        changeOwner(_newOwner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        cosmosBridge(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        cosmosDepositNonce(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        createNewBridgeToken(_symbol: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        getBridgeToken(_symbol: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCosmosTokenInWhiteList(_token: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getLockedFunds(_symbol: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getLockedTokenAddress(_symbol: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getTokenInEthWhiteList(_token: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hasBlocklist(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "initialize()"(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        "initialize(address,address,address,address)"(_operatorAddress: string, _cosmosBridgeAddress: string, _owner: string, _pauser: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        lock(_recipient: BytesLike, _token: string, _amount: BigNumberish, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        lockBurnNonce(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lockedFunds(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lockedTokenList(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lowerToUpperTokens(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        maxTokenAmount(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        mintBridgeTokens(_intendedRecipient: string, _symbol: string, _amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        operator(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        oracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pause(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pausers(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renouncePauser(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        safeLowerToUpperTokens(_symbol: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setBlocklist(blocklistAddress: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        toLower(str: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        tokenFallback(_from: string, _value: BigNumberish, _data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        unlock(_recipient: string, _symbol: string, _amount: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        unpause(overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        updateEthWhiteList(_token: string, _inList: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        verifySifPrefix(_sifAddress: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
