/* eslint-disable */
import Long from "long";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "sifnode.clp.v1";

/** Params - used for initializing default parameter for clp at genesis */
export interface Params {
  minCreatePoolThreshold: number;
}

export interface RewardParams {
  /** in blocks */
  liquidityRemovalLockPeriod: number;
  /** in blocks */
  liquidityRemovalCancelPeriod: number;
  rewardPeriods: RewardPeriod[];
  /** start time of the current (or last) reward period */
  rewardPeriodStartTime: string;
}

/** These params are non-governable and are calculated on chain */
export interface PmtpRateParams {
  pmtpPeriodBlockRate: string;
  pmtpCurrentRunningRate: string;
  pmtpInterPolicyRate: string;
}

export interface PmtpParams {
  pmtpPeriodGovernanceRate: string;
  pmtpPeriodEpochLength: number;
  pmtpPeriodStartBlock: number;
  pmtpPeriodEndBlock: number;
}

export interface RewardPeriod {
  rewardPeriodId: string;
  rewardPeriodStartBlock: number;
  rewardPeriodEndBlock: number;
  rewardPeriodAllocation: string;
  rewardPeriodPoolMultipliers: PoolMultiplier[];
  rewardPeriodDefaultMultiplier: string;
}

export interface PoolMultiplier {
  poolMultiplierAsset: string;
  multiplier: string;
}

function createBaseParams(): Params {
  return { minCreatePoolThreshold: 0 };
}

export const Params = {
  encode(
    message: Params,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.minCreatePoolThreshold !== 0) {
      writer.uint32(8).uint64(message.minCreatePoolThreshold);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.minCreatePoolThreshold = longToNumber(
            reader.uint64() as Long,
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Params {
    return {
      minCreatePoolThreshold: isSet(object.minCreatePoolThreshold)
        ? Number(object.minCreatePoolThreshold)
        : 0,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    message.minCreatePoolThreshold !== undefined &&
      (obj.minCreatePoolThreshold = Math.round(message.minCreatePoolThreshold));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.minCreatePoolThreshold = object.minCreatePoolThreshold ?? 0;
    return message;
  },
};

function createBaseRewardParams(): RewardParams {
  return {
    liquidityRemovalLockPeriod: 0,
    liquidityRemovalCancelPeriod: 0,
    rewardPeriods: [],
    rewardPeriodStartTime: "",
  };
}

export const RewardParams = {
  encode(
    message: RewardParams,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.liquidityRemovalLockPeriod !== 0) {
      writer.uint32(8).uint64(message.liquidityRemovalLockPeriod);
    }
    if (message.liquidityRemovalCancelPeriod !== 0) {
      writer.uint32(16).uint64(message.liquidityRemovalCancelPeriod);
    }
    for (const v of message.rewardPeriods) {
      RewardPeriod.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.rewardPeriodStartTime !== "") {
      writer.uint32(42).string(message.rewardPeriodStartTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RewardParams {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRewardParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.liquidityRemovalLockPeriod = longToNumber(
            reader.uint64() as Long,
          );
          break;
        case 2:
          message.liquidityRemovalCancelPeriod = longToNumber(
            reader.uint64() as Long,
          );
          break;
        case 4:
          message.rewardPeriods.push(
            RewardPeriod.decode(reader, reader.uint32()),
          );
          break;
        case 5:
          message.rewardPeriodStartTime = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RewardParams {
    return {
      liquidityRemovalLockPeriod: isSet(object.liquidityRemovalLockPeriod)
        ? Number(object.liquidityRemovalLockPeriod)
        : 0,
      liquidityRemovalCancelPeriod: isSet(object.liquidityRemovalCancelPeriod)
        ? Number(object.liquidityRemovalCancelPeriod)
        : 0,
      rewardPeriods: Array.isArray(object?.rewardPeriods)
        ? object.rewardPeriods.map((e: any) => RewardPeriod.fromJSON(e))
        : [],
      rewardPeriodStartTime: isSet(object.rewardPeriodStartTime)
        ? String(object.rewardPeriodStartTime)
        : "",
    };
  },

  toJSON(message: RewardParams): unknown {
    const obj: any = {};
    message.liquidityRemovalLockPeriod !== undefined &&
      (obj.liquidityRemovalLockPeriod = Math.round(
        message.liquidityRemovalLockPeriod,
      ));
    message.liquidityRemovalCancelPeriod !== undefined &&
      (obj.liquidityRemovalCancelPeriod = Math.round(
        message.liquidityRemovalCancelPeriod,
      ));
    if (message.rewardPeriods) {
      obj.rewardPeriods = message.rewardPeriods.map((e) =>
        e ? RewardPeriod.toJSON(e) : undefined,
      );
    } else {
      obj.rewardPeriods = [];
    }
    message.rewardPeriodStartTime !== undefined &&
      (obj.rewardPeriodStartTime = message.rewardPeriodStartTime);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RewardParams>, I>>(
    object: I,
  ): RewardParams {
    const message = createBaseRewardParams();
    message.liquidityRemovalLockPeriod = object.liquidityRemovalLockPeriod ?? 0;
    message.liquidityRemovalCancelPeriod =
      object.liquidityRemovalCancelPeriod ?? 0;
    message.rewardPeriods =
      object.rewardPeriods?.map((e) => RewardPeriod.fromPartial(e)) || [];
    message.rewardPeriodStartTime = object.rewardPeriodStartTime ?? "";
    return message;
  },
};

function createBasePmtpRateParams(): PmtpRateParams {
  return {
    pmtpPeriodBlockRate: "",
    pmtpCurrentRunningRate: "",
    pmtpInterPolicyRate: "",
  };
}

export const PmtpRateParams = {
  encode(
    message: PmtpRateParams,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.pmtpPeriodBlockRate !== "") {
      writer.uint32(18).string(message.pmtpPeriodBlockRate);
    }
    if (message.pmtpCurrentRunningRate !== "") {
      writer.uint32(26).string(message.pmtpCurrentRunningRate);
    }
    if (message.pmtpInterPolicyRate !== "") {
      writer.uint32(34).string(message.pmtpInterPolicyRate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PmtpRateParams {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePmtpRateParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.pmtpPeriodBlockRate = reader.string();
          break;
        case 3:
          message.pmtpCurrentRunningRate = reader.string();
          break;
        case 4:
          message.pmtpInterPolicyRate = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PmtpRateParams {
    return {
      pmtpPeriodBlockRate: isSet(object.pmtpPeriodBlockRate)
        ? String(object.pmtpPeriodBlockRate)
        : "",
      pmtpCurrentRunningRate: isSet(object.pmtpCurrentRunningRate)
        ? String(object.pmtpCurrentRunningRate)
        : "",
      pmtpInterPolicyRate: isSet(object.pmtpInterPolicyRate)
        ? String(object.pmtpInterPolicyRate)
        : "",
    };
  },

  toJSON(message: PmtpRateParams): unknown {
    const obj: any = {};
    message.pmtpPeriodBlockRate !== undefined &&
      (obj.pmtpPeriodBlockRate = message.pmtpPeriodBlockRate);
    message.pmtpCurrentRunningRate !== undefined &&
      (obj.pmtpCurrentRunningRate = message.pmtpCurrentRunningRate);
    message.pmtpInterPolicyRate !== undefined &&
      (obj.pmtpInterPolicyRate = message.pmtpInterPolicyRate);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PmtpRateParams>, I>>(
    object: I,
  ): PmtpRateParams {
    const message = createBasePmtpRateParams();
    message.pmtpPeriodBlockRate = object.pmtpPeriodBlockRate ?? "";
    message.pmtpCurrentRunningRate = object.pmtpCurrentRunningRate ?? "";
    message.pmtpInterPolicyRate = object.pmtpInterPolicyRate ?? "";
    return message;
  },
};

function createBasePmtpParams(): PmtpParams {
  return {
    pmtpPeriodGovernanceRate: "",
    pmtpPeriodEpochLength: 0,
    pmtpPeriodStartBlock: 0,
    pmtpPeriodEndBlock: 0,
  };
}

export const PmtpParams = {
  encode(
    message: PmtpParams,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.pmtpPeriodGovernanceRate !== "") {
      writer.uint32(10).string(message.pmtpPeriodGovernanceRate);
    }
    if (message.pmtpPeriodEpochLength !== 0) {
      writer.uint32(16).int64(message.pmtpPeriodEpochLength);
    }
    if (message.pmtpPeriodStartBlock !== 0) {
      writer.uint32(24).int64(message.pmtpPeriodStartBlock);
    }
    if (message.pmtpPeriodEndBlock !== 0) {
      writer.uint32(32).int64(message.pmtpPeriodEndBlock);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PmtpParams {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePmtpParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pmtpPeriodGovernanceRate = reader.string();
          break;
        case 2:
          message.pmtpPeriodEpochLength = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.pmtpPeriodStartBlock = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.pmtpPeriodEndBlock = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PmtpParams {
    return {
      pmtpPeriodGovernanceRate: isSet(object.pmtpPeriodGovernanceRate)
        ? String(object.pmtpPeriodGovernanceRate)
        : "",
      pmtpPeriodEpochLength: isSet(object.pmtpPeriodEpochLength)
        ? Number(object.pmtpPeriodEpochLength)
        : 0,
      pmtpPeriodStartBlock: isSet(object.pmtpPeriodStartBlock)
        ? Number(object.pmtpPeriodStartBlock)
        : 0,
      pmtpPeriodEndBlock: isSet(object.pmtpPeriodEndBlock)
        ? Number(object.pmtpPeriodEndBlock)
        : 0,
    };
  },

  toJSON(message: PmtpParams): unknown {
    const obj: any = {};
    message.pmtpPeriodGovernanceRate !== undefined &&
      (obj.pmtpPeriodGovernanceRate = message.pmtpPeriodGovernanceRate);
    message.pmtpPeriodEpochLength !== undefined &&
      (obj.pmtpPeriodEpochLength = Math.round(message.pmtpPeriodEpochLength));
    message.pmtpPeriodStartBlock !== undefined &&
      (obj.pmtpPeriodStartBlock = Math.round(message.pmtpPeriodStartBlock));
    message.pmtpPeriodEndBlock !== undefined &&
      (obj.pmtpPeriodEndBlock = Math.round(message.pmtpPeriodEndBlock));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PmtpParams>, I>>(
    object: I,
  ): PmtpParams {
    const message = createBasePmtpParams();
    message.pmtpPeriodGovernanceRate = object.pmtpPeriodGovernanceRate ?? "";
    message.pmtpPeriodEpochLength = object.pmtpPeriodEpochLength ?? 0;
    message.pmtpPeriodStartBlock = object.pmtpPeriodStartBlock ?? 0;
    message.pmtpPeriodEndBlock = object.pmtpPeriodEndBlock ?? 0;
    return message;
  },
};

function createBaseRewardPeriod(): RewardPeriod {
  return {
    rewardPeriodId: "",
    rewardPeriodStartBlock: 0,
    rewardPeriodEndBlock: 0,
    rewardPeriodAllocation: "",
    rewardPeriodPoolMultipliers: [],
    rewardPeriodDefaultMultiplier: "",
  };
}

export const RewardPeriod = {
  encode(
    message: RewardPeriod,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.rewardPeriodId !== "") {
      writer.uint32(10).string(message.rewardPeriodId);
    }
    if (message.rewardPeriodStartBlock !== 0) {
      writer.uint32(16).uint64(message.rewardPeriodStartBlock);
    }
    if (message.rewardPeriodEndBlock !== 0) {
      writer.uint32(24).uint64(message.rewardPeriodEndBlock);
    }
    if (message.rewardPeriodAllocation !== "") {
      writer.uint32(34).string(message.rewardPeriodAllocation);
    }
    for (const v of message.rewardPeriodPoolMultipliers) {
      PoolMultiplier.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (message.rewardPeriodDefaultMultiplier !== "") {
      writer.uint32(50).string(message.rewardPeriodDefaultMultiplier);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RewardPeriod {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRewardPeriod();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rewardPeriodId = reader.string();
          break;
        case 2:
          message.rewardPeriodStartBlock = longToNumber(
            reader.uint64() as Long,
          );
          break;
        case 3:
          message.rewardPeriodEndBlock = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.rewardPeriodAllocation = reader.string();
          break;
        case 5:
          message.rewardPeriodPoolMultipliers.push(
            PoolMultiplier.decode(reader, reader.uint32()),
          );
          break;
        case 6:
          message.rewardPeriodDefaultMultiplier = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RewardPeriod {
    return {
      rewardPeriodId: isSet(object.rewardPeriodId)
        ? String(object.rewardPeriodId)
        : "",
      rewardPeriodStartBlock: isSet(object.rewardPeriodStartBlock)
        ? Number(object.rewardPeriodStartBlock)
        : 0,
      rewardPeriodEndBlock: isSet(object.rewardPeriodEndBlock)
        ? Number(object.rewardPeriodEndBlock)
        : 0,
      rewardPeriodAllocation: isSet(object.rewardPeriodAllocation)
        ? String(object.rewardPeriodAllocation)
        : "",
      rewardPeriodPoolMultipliers: Array.isArray(
        object?.rewardPeriodPoolMultipliers,
      )
        ? object.rewardPeriodPoolMultipliers.map((e: any) =>
            PoolMultiplier.fromJSON(e),
          )
        : [],
      rewardPeriodDefaultMultiplier: isSet(object.rewardPeriodDefaultMultiplier)
        ? String(object.rewardPeriodDefaultMultiplier)
        : "",
    };
  },

  toJSON(message: RewardPeriod): unknown {
    const obj: any = {};
    message.rewardPeriodId !== undefined &&
      (obj.rewardPeriodId = message.rewardPeriodId);
    message.rewardPeriodStartBlock !== undefined &&
      (obj.rewardPeriodStartBlock = Math.round(message.rewardPeriodStartBlock));
    message.rewardPeriodEndBlock !== undefined &&
      (obj.rewardPeriodEndBlock = Math.round(message.rewardPeriodEndBlock));
    message.rewardPeriodAllocation !== undefined &&
      (obj.rewardPeriodAllocation = message.rewardPeriodAllocation);
    if (message.rewardPeriodPoolMultipliers) {
      obj.rewardPeriodPoolMultipliers = message.rewardPeriodPoolMultipliers.map(
        (e) => (e ? PoolMultiplier.toJSON(e) : undefined),
      );
    } else {
      obj.rewardPeriodPoolMultipliers = [];
    }
    message.rewardPeriodDefaultMultiplier !== undefined &&
      (obj.rewardPeriodDefaultMultiplier =
        message.rewardPeriodDefaultMultiplier);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RewardPeriod>, I>>(
    object: I,
  ): RewardPeriod {
    const message = createBaseRewardPeriod();
    message.rewardPeriodId = object.rewardPeriodId ?? "";
    message.rewardPeriodStartBlock = object.rewardPeriodStartBlock ?? 0;
    message.rewardPeriodEndBlock = object.rewardPeriodEndBlock ?? 0;
    message.rewardPeriodAllocation = object.rewardPeriodAllocation ?? "";
    message.rewardPeriodPoolMultipliers =
      object.rewardPeriodPoolMultipliers?.map((e) =>
        PoolMultiplier.fromPartial(e),
      ) || [];
    message.rewardPeriodDefaultMultiplier =
      object.rewardPeriodDefaultMultiplier ?? "";
    return message;
  },
};

function createBasePoolMultiplier(): PoolMultiplier {
  return { poolMultiplierAsset: "", multiplier: "" };
}

export const PoolMultiplier = {
  encode(
    message: PoolMultiplier,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.poolMultiplierAsset !== "") {
      writer.uint32(10).string(message.poolMultiplierAsset);
    }
    if (message.multiplier !== "") {
      writer.uint32(18).string(message.multiplier);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PoolMultiplier {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePoolMultiplier();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolMultiplierAsset = reader.string();
          break;
        case 2:
          message.multiplier = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PoolMultiplier {
    return {
      poolMultiplierAsset: isSet(object.poolMultiplierAsset)
        ? String(object.poolMultiplierAsset)
        : "",
      multiplier: isSet(object.multiplier) ? String(object.multiplier) : "",
    };
  },

  toJSON(message: PoolMultiplier): unknown {
    const obj: any = {};
    message.poolMultiplierAsset !== undefined &&
      (obj.poolMultiplierAsset = message.poolMultiplierAsset);
    message.multiplier !== undefined && (obj.multiplier = message.multiplier);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PoolMultiplier>, I>>(
    object: I,
  ): PoolMultiplier {
    const message = createBasePoolMultiplier();
    message.poolMultiplierAsset = object.poolMultiplierAsset ?? "";
    message.multiplier = object.multiplier ?? "";
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
