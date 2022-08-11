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
    activeConnector?.addListener("change", fetch);

    return () => {
      activeConnector?.removeListener("change", fetch);
    };
  }, [activeConnector, fetch]);

  useEffect(() => {
    if (options.enabled) {
      fetch();
    }
  }, [activeConnector, fetch, options.enabled]);

  return { signer, status };
};

export const useStargateClient = (
  chainId: string,
  options: HookOptions = { enabled: true },
) => {
  const { activeConnector } = useConnect();

  const {
    data: client,
    fetch,
    status,
  } = useAsyncFunc(
    async () => activeConnector?.getStargateClient(chainId),
    [activeConnector, chainId],
  );

  useEffect(() => {
    if (options.enabled) {
      fetch();
    }
  }, [activeConnector, fetch, options.enabled]);

  return { client, status };
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
  }, [activeConnector, fetch, options.enabled]);

  return { client, status };
};

export const useAccounts = (
  chainId: string,
  options: HookOptions = { enabled: true },
) => {
  const { signer } = useSigner(chainId, options);

  const {
    data: accounts,
    fetch,
    status,
  } = useAsyncFunc(async () => signer?.getAccounts(), [signer, chainId]);

  useEffect(() => {
    if (options.enabled) {
      fetch();
    }
  }, [fetch, options.enabled]);

  return { accounts, status };
};
