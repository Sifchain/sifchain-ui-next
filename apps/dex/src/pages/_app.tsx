import type { AppProps } from "next/app";
import { useState } from "react";
import { CookiesProvider } from "react-cookie";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import "../styles/globals.css";

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
    <>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <CookiesProvider>
            <Component {...pageProps} />
          </CookiesProvider>
        </Hydrate>
        <ReactQueryDevtools position="bottom-right" />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
