import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon, XIcon } from "@heroicons/react/outline";
import {
  AppearTransition,
  BalanceIcon,
  ChangelogIcon,
  formatNumberAsCurrency,
  LockIcon,
  Logo,
  LogoFull,
  PoolsIcon,
  RowanIcon,
  SwapIcon,
  useWindowSize,
} from "@sifchain/ui";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

import WalletConnector from "~/compounds/WalletConnector";
import { useRowanPriceQuery, useTVLQuery } from "~/domains/clp/hooks";

export const MENU_ITEMS = [
  {
    title: "Swap",
    href: "/swap",
    icon: <SwapIcon />,
  },
  {
    title: "Balance",
    href: "/balances",
    icon: <BalanceIcon />,
  },
  {
    title: "Pools",
    href: "/pools",
    icon: <PoolsIcon />,
  },
  {
    title: "Changelog",
    href: "/changelog",
    icon: <ChangelogIcon />,
  },
];

const Header = () => {
  const router = useRouter();
  const currentPath = router.asPath;

  const { data: TVL, isLoading: isLoadingTVL } = useTVLQuery();
  const { data: rowanPrice, isLoading: isLoadingRowanPrice } =
    useRowanPriceQuery();

  const windowSize = useWindowSize();

  const rowanStats = [
    {
      id: "price",
      icon: <RowanIcon />,
      label: (
        <>
          {" "}
          {isLoadingRowanPrice ? "..." : formatNumberAsCurrency(rowanPrice)}
          <span className="ml-2">/</span>
        </>
      ),
    },
    {
      id: "tvl",
      icon: <LockIcon />,
      label: <>{isLoadingTVL ? "..." : formatNumberAsCurrency(TVL)} TVL</>,
    },
  ];

  return (
    <header className="bg-black md:p-4 grid ">
      {windowSize.width && (
        <Disclosure
          as="div"
          className="block md:flex md:items-center md:gap-8 justify-between"
          defaultOpen={windowSize.width >= 768}
        >
          {({ open }) => (
            <>
              <section className="flex justify-between items-center md:grid md:place-items-center shadow-inset-border">
                <Link href="/">
                  <a className="md:p-0">
                    <LogoFull className="hidden md:inline-block h-24 md:h-12" />
                    <Logo className="h-8 md:hidden" />
                  </a>
                </Link>
                <div className="md:hidden">
                  <Disclosure.Button className="p-4">
                    {open ? (
                      <XIcon className="h-6 w-6" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>
              </section>
              <AppearTransition show={open}>
                <Disclosure.Panel
                  className="grid md:flex p-4 md:p-0 gap-4 xl:gap-6 4xl:gap-8 md:w-full"
                  static={windowSize.width >= 768}
                >
                  <nav className="w-full md:flex md:flex-1 md:justify-center">
                    <ul className="grid gap-2 md:flex items-center md:gap-4 xl:gap-5 4xl:gap-8">
                      {MENU_ITEMS.slice(0, 3).map(({ title, href }) => (
                        <li key={title}>
                          <Link href={href}>
                            <a
                              role="navigation"
                              className={clsx(
                                "flex items-center gap-4 p-2 hover:bg-gray-800 hover:opacity-80 rounded-md transition-all",
                                {
                                  "bg-gray-600": currentPath === href,
                                },
                              )}
                            >
                              <span className="text-gray-200 font-semibold text-sm">
                                {title}
                              </span>
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <section className="md:items-center gap-2 bg-gray-800 rounded flex justify-center m-auto flex-nowrap max-w-min md:max-w-auto px-1.5 py-1">
                    {rowanStats.map(({ id, icon, label }) => (
                      <div
                        key={id}
                        className="flex items-center gap-1 text-gray-300 whitespace-nowrap"
                      >
                        <span className="h-6 w-6 grid place-items-center">
                          {icon}
                        </span>
                        <span className="font-semibold text-xs">{label}</span>
                      </div>
                    ))}
                  </section>
                  <WalletConnector />
                </Disclosure.Panel>
              </AppearTransition>
            </>
          )}
        </Disclosure>
      )}
    </header>
  );
};

export default Header;
