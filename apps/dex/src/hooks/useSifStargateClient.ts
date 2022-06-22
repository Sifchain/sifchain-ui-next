import { useSigner } from "@sifchain/cosmos-connect";
import { SifSigningStargateClient } from "@sifchain/stargate";
import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";

export const useSifStargateClient = () => {
  const { data: env } = useDexEnvironment();

  return useQuery(
    "sif-stargate-client",
    () => SifSigningStargateClient.connect(env?.sifRpcUrl ?? ""),
    { enabled: env !== undefined },
  );
};

export const useSifSigningStargateClient = () => {
  const { data: env } = useDexEnvironment();
  const { signer } = useSigner(env?.sifChainId ?? "", {
    enabled: env?.sifChainId !== undefined,
  });

  return useQuery(
    "sif-signing-stargate-client",
    () =>
      SifSigningStargateClient.connectWithSigner(
        env?.sifRpcUrl ?? "",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        signer!,
      ),
    { enabled: signer !== undefined && env !== undefined },
  );
};