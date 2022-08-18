import { Button, SifchainLogoSmall } from "@sifchain/ui";
import clsx from "clsx";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import "~/styles/globals.css";

const NAV_LINKS = [
  {
    href: "/assets",
    label: "Assets",
  },
  {
    href: "/providers",
    label: "Providers",
  },
];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentPath = router.asPath;

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
      <Head>
        <title>Sifchain Registry</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <div className="to-gray-850 flex min-h-screen flex-col gap-8 bg-gradient-to-b from-gray-900 text-gray-50 antialiased">
          <header className="bg-black/90 p-6">
            <div className="mx-auto flex max-w-6xl items-center gap-8">
              <Link href="/">
                <div className="flex items-center gap-2" role="button">
                  <SifchainLogoSmall className="text-4xl" /> Registry
                </div>
              </Link>
              <div className="flex flex-1 justify-center gap-2">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link key={href} href={href}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className={clsx("bg-gray-900 transition-all duration-300 hover:opacity-80", {
                        "bg-gray-700": currentPath === href,
                      })}
                    >
                      {label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </header>
          <section className="max-w-screen mx-auto w-full flex-1 p-2 md:max-w-6xl md:p-0">
            <Component {...pageProps} />
          </section>
          <footer className="mx-auto grid w-full max-w-6xl place-items-center p-4">
            © {new Date().getFullYear()} - sifchain core
          </footer>
        </div>
        <ReactQueryDevtools position="bottom-right" />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
