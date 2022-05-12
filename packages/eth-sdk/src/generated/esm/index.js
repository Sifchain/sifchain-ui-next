import { Contract } from 'ethers';
import mainnetPeggyBridgeBankAbi from '../../eth-sdk/abis/mainnet/peggy/bridgeBank.json';
export function getContract(address, abi, defaultSigner) {
    return new Contract(address, abi, defaultSigner);
}
export function getMainnetSdk(defaultSigner) {
    return {
        "peggy": {
            "bridgeBank": getContract('0xB5F54ac4466f5ce7E0d8A5cB9FE7b8c0F35B7Ba8', mainnetPeggyBridgeBankAbi, defaultSigner),
        },
    };
}
