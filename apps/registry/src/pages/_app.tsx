import "~/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Button, SifchainLogoSmall } from "@sifchain/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

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

  return (
    <>
      <Head>
        <title>Sifchain Registry</title>
      </Head>
      <div className="antialiased bg-gradient-to-b from-gray-900 to-gray-850 min-h-screen text-gray-50 flex flex-col gap-8">
        <header className="p-6 bg-black/90 flex items-center gap-8">
          <Link href="/">
            <div className="flex items-center gap-2" role="button">
              <SifchainLogoSmall className="text-4xl" /> Registry
            </div>
          </Link>
          <div className="flex-1 flex justify-center gap-2">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <Button
                  variant="secondary"
                  size="sm"
                  className={clsx(
                    "bg-gray-900 hover:opacity-80 transition-all duration-300",
                    {
                      "bg-gray-700": currentPath === href,
                    },
                  )}
                >
                  {label}
                </Button>
              </Link>
            ))}
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
