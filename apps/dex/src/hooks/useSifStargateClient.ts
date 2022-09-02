import { useSigner } from "@sifchain/cosmos-connect";
import { SifSigningStargateClient } from "@sifchain/stargate";
import { useQuery } from "@tanstack/react-query";
import { useDexEnvironment } from "~/domains/core/envs";

export const useSifStargateClient = () => {
  const { data: env } = useDexEnvironment();

  return useQuery(["sif-stargate-client"], () => SifSigningStargateClient.connect(env?.sifRpcUrl ?? ""), {
    enabled: env !== undefined,
  });
};

export const useSifSigningStargateClient = () => {
  const { data: env } = useDexEnvironment();
  const { signer, signerUpdatedAt } = useSigner(env?.sifChainId ?? "", {
    enabled: env?.sifChainId !== undefined,
  });

  return useQuery(
    ["sif-signing-stargate-client", { signerUpdatedAt }],
    () => SifSigningStargateClient.connectWithSigner(env?.sifRpcUrl ?? "", signer!),
    { enabled: signer !== undefined && env !== undefined },
  );
};
