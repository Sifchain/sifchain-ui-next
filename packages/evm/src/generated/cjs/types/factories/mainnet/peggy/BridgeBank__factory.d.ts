import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { BridgeBank, BridgeBankInterface } from "../../../mainnet/peggy/BridgeBank";
export declare class BridgeBank__factory {
  static readonly abi: (
    | {
        anonymous: boolean;
        inputs: {
          indexed: boolean;
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        type: string;
        constant?: undefined;
        outputs?: undefined;
        payable?: undefined;
        stateMutability?: undefined;
      }
    | {
        constant: boolean;
        inputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        outputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
  )[];
  static createInterface(): BridgeBankInterface;
  static connect(address: string, signerOrProvider: Signer | Provider): BridgeBank;
}
