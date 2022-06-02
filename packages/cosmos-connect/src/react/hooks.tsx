import { useContext, useEffect } from "react";
import { CosmConnectContext } from "./provider";
import { useAsyncFunc } from "./utils/hooks";

export type HookOptions = {
  enabled: boolean;
};

export const useConnect = () => {
  const { connectors, activeConnector, connect, disconnect } =
    useContext(CosmConnectContext);

  const connectAsyncFunc = useAsyncFunc(connect);
  const disconnectAsyncFunc = useAsyncFunc(disconnect);

  return {
    connectors,
    activeConnector,
    isConnected: activeConnector !== undefined,
    connect: connectAsyncFunc.fetch,
    connectingStatus: connectAsyncFunc.status,
    disconnect: disconnectAsyncFunc.fetch,
    disconnectingStatus: disconnectAsyncFunc.status,
  };
};

export const useSigner = (
  chainId: string,
  options: HookOptions = { enabled: true },
) => {
  const { activeConnector } = useConnect();

  const {
    data: signer,
    fetch,
    status,
  } = useAsyncFunc(
    async () => activeConnector?.getSigner(chainId),
    [activeConnector, chainId],
  );

  useEffect(() => {
    if (options.enabled) {
      fetch();
    }
  }, [activeConnector, options.enabled]);

  return { signer, status };
};

export const useSigningStargateClient = (
  chainId: string,
  options: HookOptions = { enabled: true },
) => {
  const { activeConnector } = useConnect();

  const {
    data: client,
    fetch,
    status,
  } = useAsyncFunc(
    async () => activeConnector?.getSigningStargateClient(chainId),
    [activeConnector, chainId],
  );

  useEffect(() => {
    if (options.enabled) {
      fetch();
    }
  }, [activeConnector, options.enabled]);

  return { client, status };
};
