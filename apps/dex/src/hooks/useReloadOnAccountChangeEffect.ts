import { useConnect as useCosmConnect } from "@sifchain/cosmos-connect";
import { useCallback, useEffect } from "react";
import { useConnect as useEvmConnect } from "wagmi";

const useReloadOnAccountChangeEffect = () => {
  const { activeConnector: activeCosmConnector } = useCosmConnect();
  const { data: activeEvmConnector } = useEvmConnect();

  const onAccountChange = useCallback(() => window.location.reload(), []);

  useEffect(() => {
    activeEvmConnector?.connector?.addListener("change", onAccountChange);

    return () => {
      activeEvmConnector?.connector?.removeListener("change", onAccountChange);
    };
  }, [activeCosmConnector, activeEvmConnector?.connector, onAccountChange]);

  useEffect(() => {
    activeCosmConnector?.addListener("change", onAccountChange);

    return () => {
      activeCosmConnector?.removeListener("change", onAccountChange);
    };
  }, [activeCosmConnector, onAccountChange]);
};

export default useReloadOnAccountChangeEffect;
