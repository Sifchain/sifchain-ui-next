import { PROFILE_LOOKUP, NetworkEnv } from "../config/getEnv";
import { getConfig } from "../config/getConfig";

export async function getSdkConfig(params: { environment: NetworkEnv }) {
  const {
    kind: tag,
    ethAssetTag,
    sifAssetTag,
  } = PROFILE_LOOKUP[params.environment];

  if (typeof tag === "undefined") {
    throw new Error(`environment "${params.environment}" not found`);
  }

  return await getConfig(tag, sifAssetTag, ethAssetTag);
}
