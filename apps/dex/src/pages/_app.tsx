import { ComposeProviders } from "@sifchain/ui";
import type { AppProps } from "next/app";
import { FC, useState } from "react";
import { CookiesProvider } from "react-cookie";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import useReloadOnAccountChangeEffect from "~/hooks/useReloadOnAccountChangeEffect";

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

  useReloadOnAccountChangeEffect();

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
