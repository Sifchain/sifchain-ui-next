import { useContext, useEffect } from "react";
import { CosmConnectContext } from "./provider";
import { useAsyncFunc } from "./utils/hooks";

export const useConnect = () => {
  const { connectors, activeConnector, connect, disconnect } =
    useContext(CosmConnectContext);

  const connectAsyncFunc = useAsyncFunc(connect);
  const disconnectAsyncFunc = useAsyncFunc(disconnect);

  return {
    connectors,
    activeConnector,
    connect: connectAsyncFunc.fetch,
    connectingStatus: connectAsyncFunc.status,
    disconnect: disconnectAsyncFunc.fetch,
    disconnectingStatus: disconnectAsyncFunc.status,
  };
};

export const useSigningStargateClient = (chainId: string) => {
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
    fetch();
  }, [activeConnector]);

  return { client, status };
};
