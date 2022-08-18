import { ComposeProviders } from "@sifchain/ui";
import type { AppProps } from "next/app";
import { FC, Fragment, useState } from "react";
import { CookiesProvider } from "react-cookie";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import useReloadOnAccountChangeEffect from "~/hooks/useReloadOnAccountChangeEffect";

import MainLayout from "~/layouts/MainLayout";
import { CosmConnectProvider } from "~/lib/cosmConnect";
import { WagmiProvider } from "~/lib/wagmi";
import "~/styles/globals.css";

const WalletsWatcher = () => {
  useReloadOnAccountChangeEffect();
  return null;
};

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <ComposeProviders providers={[typeof window !== "undefined" ? CosmConnectProvider : Fragment, WagmiProvider]}>
      <WalletsWatcher />
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
