import { useConnectionUpdatedAt, useSigner } from "@sifchain/cosmos-connect";
import { SifSigningStargateClient } from "@sifchain/stargate";
import { useChangedEffect } from "@sifchain/utils/react";
import { useQuery } from "@tanstack/react-query";
import { useDexEnvironment } from "~/domains/core/envs";
import { useQueryWithNonQueryKeyDeps } from "./useQueryWithNonSerializableDeps";

export const useSifStargateClient = () => {
  const { data: env } = useDexEnvironment();

  return useQuery(["sif-stargate-client"], () => SifSigningStargateClient.connect(env?.sifRpcUrl ?? ""), {
    enabled: env !== undefined,
  });
};

export const useSifSigningStargateClient = () => {
  const { data: env } = useDexEnvironment();
  const { signer } = useSigner(env?.sifChainId ?? "", {
    enabled: env?.sifChainId !== undefined,
  });
  const connectionUpdatedAt = useConnectionUpdatedAt();

  return useQueryWithNonQueryKeyDeps(
    ["sif-signing-stargate-client"],
    () => SifSigningStargateClient.connectWithSigner(env?.sifRpcUrl ?? "", signer!),
    { enabled: signer !== undefined && env !== undefined },
    [connectionUpdatedAt],
  );
};
