import { Disclosure, Menu } from "@headlessui/react";
import { ChevronDownIcon, XIcon } from "@heroicons/react/outline";
import {
  AppearTransition,
  BalanceIcon,
  ChangelogIcon,
  DotsVerticalIcon,
  formatNumberAsCurrency,
  LockIcon,
  SifchainLogoSmall,
  PlusIcon,
  PoolsIcon,
  RowanIcon,
  SurfaceB,
  SwapIcon,
  useWindowSize,
} from "@sifchain/ui";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

import WalletConnector from "~/compounds/WalletConnector";
import { useRowanPriceQuery, useTVLQuery } from "~/domains/clp/hooks";
import { useFeatureFlag } from "~/lib/featureFlags";

export function useMenuItems() {
  const isMarginEnabled = useFeatureFlag("margin");
  return [
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
      title: "Margin",
      href: "/margin",
      icon: <PlusIcon />,
      hidden: !isMarginEnabled,
    },
    {
      title: "Changelog",
      href: "/changelog",
      icon: <ChangelogIcon />,
    },
  ].filter((x) => !x.hidden);
}

const Header = () => {
  const windowSize = useWindowSize();
  const isMarginStandaloneOn = useFeatureFlag("margin-standalone");

  return (
    <header className="grid bg-black md:p-4">
      {Boolean(windowSize.width) && (
        <Disclosure
          as="div"
          className="md:shadow-inset-border block justify-between shadow-none md:flex md:items-center md:gap-8 md:pb-2"
          defaultOpen={windowSize.width >= 768}
        >
          {({ open }) => (
            <>
              <section className="shadow-inset-border flex items-center justify-between md:grid md:place-items-center md:shadow-none">
                <Link href={isMarginStandaloneOn ? "/margin" : "/"}>
                  <a className="flex items-center gap-4 p-2 md:p-1">
                    <SifchainLogoSmall className="inline-block text-[44px]" />
                    {isMarginStandaloneOn && <h1 className="pl-3 text-2xl font-semibold">Margin</h1>}
                  </a>
                </Link>
                <div className="md:hidden">
                  <Disclosure.Button className="p-4">
                    {open ? <XIcon className="h-6 w-6" /> : <ChevronDownIcon className="h-6 w-6" />}
                  </Disclosure.Button>
                </div>
              </section>
              <AppearTransition show={open}>
                <Disclosure.Panel
                  className="absolute top-14 left-0 right-0 z-10 bg-black md:relative md:top-0 md:flex md:w-full"
                  static={windowSize.width >= 768}
                >
                  <div className="4xl:gap-8 grid gap-4 p-4 md:flex md:w-full md:p-0 xl:gap-6">
                    {!isMarginStandaloneOn ? <Nav /> : <div className="flex-1" />}
                    <RowanStats />
                    <WalletConnector />
                  </div>
                </Disclosure.Panel>
              </AppearTransition>
            </>
          )}
        </Disclosure>
      )}
    </header>
  );
};

const Nav = ({ visibleItems = 3 }) => {
  const router = useRouter();
  const currentPath = router.asPath;

  const menuItems = useMenuItems();

  return (
    <nav className="w-full md:flex md:flex-1 md:justify-center">
      <ul className="4xl:gap-8 grid items-center gap-2 md:flex md:gap-4 xl:gap-5">
        {menuItems.slice(0, visibleItems).map(({ title, href }) => (
          <li key={title}>
            <Link href={href}>
              <a
                role="navigation"
                className={clsx(
                  "flex items-center gap-4 rounded-md p-2 transition-all hover:bg-gray-800 hover:opacity-80",
                  {
                    "bg-gray-600": currentPath === href,
                  },
                )}
              >
                <span className="text-sm font-semibold text-gray-200">{title}</span>
              </a>
            </Link>
          </li>
        ))}
        <li className="relative flex items-center">
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button
                  className={clsx("rotate-90", {
                    "rounded-full ring-1 ring-gray-50 ring-offset-4 ring-offset-gray-800": open,
                  })}
                >
                  <DotsVerticalIcon className="h-4 w-4" />
                </Menu.Button>
                <Menu.Items as={SurfaceB} className="absolute top-7 right-0 z-10 grid gap-2 p-2">
                  {menuItems.slice(visibleItems).map(({ title, href }) => (
                    <Menu.Item key={title}>
                      <Link href={href}>
                        <a
                          role="navigation"
                          className={clsx(
                            "flex items-center gap-4 rounded-md p-2 transition-all hover:bg-gray-800 hover:opacity-80",
                            {
                              "bg-gray-600": currentPath === href,
                            },
                          )}
                        >
                          <span className="text-sm font-semibold text-gray-200">{title}</span>
                        </a>
                      </Link>
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </>
            )}
          </Menu>
        </li>
      </ul>
    </nav>
  );
};

const RowanStats = () => {
  const { data: TVL, isLoading: isLoadingTVL } = useTVLQuery();
  const { data: rowanPrice, isLoading: isLoadingRowanPrice } = useRowanPriceQuery();

  const rowanStats = [
    {
      id: "price",
      icon: <RowanIcon />,
      label: (
        <>
          {isLoadingRowanPrice || isNaN(rowanPrice) ? "..." : formatNumberAsCurrency(rowanPrice, 4)}
          <span className="ml-3">/</span>
        </>
      ),
    },
    {
      id: "tvl",
      icon: <LockIcon />,
      label: <>{isLoadingTVL || isNaN(TVL) ? "..." : formatNumberAsCurrency(TVL)} TVL</>,
    },
  ];

  return (
    <section className="md:max-w-auto m-auto flex max-w-min flex-nowrap justify-center gap-2 rounded px-1.5 py-1 md:items-center">
      {rowanStats.map(({ id, icon, label }) => (
        <div key={id} className="flex items-center gap-1 whitespace-nowrap font-normal text-gray-300">
          <span className="grid h-6 w-6 place-items-center">{icon}</span>
          <span className="text-xs font-semibold">{label}</span>
        </div>
      ))}
    </section>
  );
};

export default Header;
