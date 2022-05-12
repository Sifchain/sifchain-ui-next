"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainnetSdk = exports.getContract = void 0;
const ethers_1 = require("ethers");
const bridgeBank_json_1 = __importDefault(require("../../eth-sdk/abis/mainnet/peggy/bridgeBank.json"));
function getContract(address, abi, defaultSigner) {
    return new ethers_1.Contract(address, abi, defaultSigner);
}
exports.getContract = getContract;
function getMainnetSdk(defaultSigner) {
    return {
        "peggy": {
            "bridgeBank": getContract('0xB5F54ac4466f5ce7E0d8A5cB9FE7b8c0F35B7Ba8', bridgeBank_json_1.default, defaultSigner),
        },
    };
}
exports.getMainnetSdk = getMainnetSdk;
