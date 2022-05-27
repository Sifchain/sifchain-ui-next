import type { OfflineSigner } from "@cosmjs/proto-signing";
import type { SigningStargateClient } from "@cosmjs/stargate";
import EventEmitter from "eventemitter3";

export type ConnectorEvents = {
  connect(): void;
  disconnect(): void;
};

export abstract class BaseCosmConnector<
  Options = any,
> extends EventEmitter<ConnectorEvents> {
  /** Unique connector id */
  abstract readonly id: string;
  /** Connector name */
  abstract readonly name: string;
  /** Options to use with connector */
  readonly options: Options;

  constructor(options: Options) {
    super();
    this.options = options;
  }

  abstract get connected(): boolean;

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract getSigner(chainId: string): Promise<OfflineSigner>;
  abstract getSigningStargateClient(
    chainId: string,
  ): Promise<SigningStargateClient>;
}
