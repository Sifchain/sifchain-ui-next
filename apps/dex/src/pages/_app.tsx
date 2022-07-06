import type { AppProps } from "next/app";
import { useState } from "react";
import { CookiesProvider } from "react-cookie";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import MainLayout from "~/layouts/MainLayout";
import { CosmConnectProvider } from "~/lib/cosmConnect";
import { WagmiProvider } from "~/lib/wagmi";
import "~/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <CosmConnectProvider>
        <WagmiProvider>
          <Hydrate state={pageProps.dehydratedState}>
            <CookiesProvider>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </CookiesProvider>
          </Hydrate>
          <ReactQueryDevtools position="bottom-right" />
        </WagmiProvider>
      </CosmConnectProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
