import { useSigner } from "@sifchain/cosmos-connect";
import { SifSigningStargateClient } from "@sifchain/stargate";
import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";

const useSifSigningStargateClient = () => {
  const { data: env } = useDexEnvironment();
  const { signer } = useSigner(env?.sifChainId!, {
    enabled: env?.sifChainId !== undefined,
  });

  return useQuery(
    "sif-signing-stargate-client",
    () => SifSigningStargateClient.connectWithSigner(env!.sifRpcUrl, signer!),
    { enabled: signer !== undefined && env !== undefined },
  );
};

export default useSifSigningStargateClient;
