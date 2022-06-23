import { Contract } from 'ethers';
import mainnet_peggy_bridgeBank_abi from '../../eth-sdk/abis/mainnet/peggy/bridgeBank.json';
export function getContract(address, abi, defaultSignerOrProvider) {
    return new Contract(address, abi, defaultSignerOrProvider);
}
export function getMainnetSdk(defaultSignerOrProvider) {
    return {
        "peggy": {
            "bridgeBank": getContract('0xB5F54ac4466f5ce7E0d8A5cB9FE7b8c0F35B7Ba8', mainnet_peggy_bridgeBank_abi, defaultSignerOrProvider),
        },
    };
}
