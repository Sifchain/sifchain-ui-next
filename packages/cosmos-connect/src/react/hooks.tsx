import { useContext, useEffect } from "react";
import { CosmConnectContext } from "./provider";
import { useAsyncFunc } from "./utils/hooks";

export type HookOptions = {
  enabled: boolean;
};

export const useConnect = () => {
  const { connectors, activeConnector, updatedAt, connect, disconnect } = useContext(CosmConnectContext);

  const connectAsyncFunc = useAsyncFunc(connect);
  const disconnectAsyncFunc = useAsyncFunc(disconnect);

  return {
    connectors,
    activeConnector,
    updatedAt,
    isConnected: activeConnector !== undefined,
    connect: connectAsyncFunc.fetch,
    connectingStatus: connectAsyncFunc.status,
    disconnect: disconnectAsyncFunc.fetch,
    disconnectingStatus: disconnectAsyncFunc.status,
  };
};

export const useSigner = (chainId: string, options: HookOptions = { enabled: true }) => {
  const { activeConnector } = useConnect();

  const {
    data: signer,
    dataUpdatedAt: signerUpdatedAt,
    fetch,
    status,
  } = useAsyncFunc(async () => activeConnector?.getSigner(chainId), [activeConnector, chainId]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    activeConnector?.addListener("change", fetch);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      activeConnector?.removeListener("change", fetch);
    };
  }, [activeConnector, fetch]);

  useEffect(() => {
    if (options.enabled) {
      void fetch();
    }
  }, [activeConnector, fetch, options.enabled]);

  return { signer, signerUpdatedAt, status };
};

export const useStargateClient = (chainId: string, options: HookOptions = { enabled: true }) => {
  const { activeConnector } = useConnect();

  const {
    data: client,
    dataUpdatedAt: clientUpdatedAt,
    fetch,
    status,
  } = useAsyncFunc(async () => activeConnector?.getStargateClient(chainId), [activeConnector, chainId]);

  useEffect(() => {
    if (options.enabled) {
      void fetch();
    }
  }, [activeConnector, fetch, options.enabled]);

  return { client, clientUpdatedAt, status };
};

export const useSigningStargateClient = (chainId: string, options: HookOptions = { enabled: true }) => {
  const { activeConnector } = useConnect();

  const {
    data: client,
    dataUpdatedAt: clientUpdatedAt,
    fetch,
    status,
  } = useAsyncFunc(async () => activeConnector?.getSigningStargateClient(chainId), [activeConnector, chainId]);

  useEffect(() => {
    if (options.enabled) {
      void fetch();
    }
  }, [activeConnector, fetch, options.enabled]);

  return { client, clientUpdatedAt, status };
};

export const useAccounts = (chainId: string, options: HookOptions = { enabled: true }) => {
  const { signer } = useSigner(chainId, options);

  const { data: accounts, fetch, status } = useAsyncFunc(async () => signer?.getAccounts(), [signer, chainId]);

  useEffect(() => {
    if (options.enabled) {
      void fetch();
    }
  }, [fetch, options.enabled]);

  return { accounts, status };
};

export const useConnectionUpdatedAt = () => {
  const { updatedAt } = useContext(CosmConnectContext);
  return updatedAt;
};
