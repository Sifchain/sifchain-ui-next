import { ComposeProviders } from "@sifchain/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { FC, Fragment, useState } from "react";
import { CookiesProvider } from "react-cookie";

import MainLayout from "~/layouts/MainLayout";
import { CosmConnectProvider } from "~/lib/cosmConnect";
import { WagmiProvider } from "~/lib/wagmi";
import EnvSwitcher from "~/compounds/EnvSwticher/EnvSwitcher";
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

  return (
    <ComposeProviders providers={[typeof window !== "undefined" ? CosmConnectProvider : Fragment, WagmiProvider]}>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
          {/* <ReactQueryDevtools position="bottom-right" /> */}
          <EnvSwitcher />
        </QueryClientProvider>
      </CookiesProvider>
    </ComposeProviders>
  );
};

export default MyApp;
