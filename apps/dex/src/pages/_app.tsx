import type { AppProps } from "next/app";
import { useState } from "react";
import { CookiesProvider } from "react-cookie";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <CookiesProvider>
          <Component {...pageProps} />
        </CookiesProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
