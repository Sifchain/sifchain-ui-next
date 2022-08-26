import { ComposeProviders } from "@sifchain/ui";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { FC, Fragment, useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider } from "react-query";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const [isEnabledReactQueryDevtools, setIsEnabledReactQueryDevtools] = useState(false);
  useEffect(() => {
    const keyName = "_querydevtools";
    const qsFlag = router.query[keyName] ?? false;
    const localstorageFlag = localStorage.getItem(keyName) ?? false;
    if (localstorageFlag && isEnabledReactQueryDevtools === false) {
      setIsEnabledReactQueryDevtools(true);
    } else if (qsFlag && isEnabledReactQueryDevtools === false) {
      localStorage.setItem(keyName, "true");
      setIsEnabledReactQueryDevtools(true);
    }
  }, [isEnabledReactQueryDevtools, router.query]);
  return (
    <ComposeProviders providers={[typeof window !== "undefined" ? CosmConnectProvider : Fragment, WagmiProvider]}>
      <WalletsWatcher />
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
          {isEnabledReactQueryDevtools ? <ReactQueryDevtools position="bottom-right" /> : null}
        </QueryClientProvider>
      </CookiesProvider>
    </ComposeProviders>
  );
};

export default MyApp;
