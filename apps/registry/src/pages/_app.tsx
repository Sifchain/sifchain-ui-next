import "~/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SifchainLogoSmall } from "@sifchain/ui";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Sifchain Registry</title>
      </Head>
      <div className="antialiased bg-gradient-to-b from-gray-900 to-gray-850 min-h-screen text-gray-50 flex flex-col gap-8">
        <header className="p-6 bg-black/90">
          <div className="flex items-center gap-2">
            <SifchainLogoSmall className="text-4xl" /> Registry
          </div>
        </header>
        <section className="max-w-6xl w-full mx-auto flex-1">
          <Component {...pageProps} />
        </section>
        <footer className="max-w-6xl w-full mx-auto grid place-items-center p-4">
          © {new Date().getFullYear()} - sifchain core
        </footer>
      </div>
    </>
  );
}

export default MyApp;
