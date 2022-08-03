import { useSigner } from "@sifchain/cosmos-connect";
import { useDexEnvironment } from "~/domains/core/envs";

const useSifSigner = () => {
  const { data: env } = useDexEnvironment();
  return useSigner(env?.sifChainId ?? "", { enabled: env !== undefined });
};

export default useSifSigner;
