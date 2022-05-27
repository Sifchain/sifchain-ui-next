import { profileLookup, NetworkEnv } from "../config/getEnv";
import { getConfig } from "../config/getConfig";

export function getSdkConfig(params: { environment: NetworkEnv }) {
  const { tag, ethAssetTag, sifAssetTag } = profileLookup[params.environment];

  console.log(`Using environment ${tag}`, ethAssetTag, sifAssetTag);

  if (typeof tag === "undefined") {
    throw new Error(`environment "${params.environment}" not found`);
  }

  return getConfig(tag, sifAssetTag, ethAssetTag);
}
