import { useConnect as useCosmConnect } from "@sifchain/cosmos-connect";
import { ComposeProviders } from "@sifchain/ui";
import type { AppProps } from "next/app";
import { FC, useCallback, useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useConnect as useEvmConnect } from "wagmi";

import MainLayout from "~/layouts/MainLayout";
import { CosmConnectProvider } from "~/lib/cosmConnect";
import { WagmiProvider } from "~/lib/wagmi";
import "~/styles/globals.css";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
        },
      }),
  );

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
    activeCosmConnector?.addListener("accountchange", onAccountChange);

    return () => {
      activeCosmConnector?.removeListener("accountchange", onAccountChange);
    };
  }, [activeCosmConnector, onAccountChange]);

  return (
    <ComposeProviders providers={[CosmConnectProvider, WagmiProvider]}>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </Hydrate>
          <ReactQueryDevtools position="bottom-right" />
        </QueryClientProvider>
      </CookiesProvider>
    </ComposeProviders>
  );
};

export default MyApp;
