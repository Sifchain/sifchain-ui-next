import { ChevronRightIcon, MoonIcon } from "@heroicons/react/outline";
import {
  BalanceIcon,
  ChangelogIcon,
  formatNumberAsCurrency,
  LockIcon,
  Logo,
  PoolsIcon,
  RowanIcon,
  SwapIcon,
  ThemeSwitcher,
} from "@sifchain/ui";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

import WalletConnector from "~/compounds/WalletConnector";

import GlobalSearch from "~/compounds/GlobalSearch";
import { useRowanPriceQuery, useTVLQuery } from "~/domains/clp/hooks";
import { useUIStore } from "~/stores/ui";

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
  const { state, actions } = useUIStore();
  const currentPath = useRouter().asPath;

  const handleBtn = (
    <button
      onClick={() => actions.toggleSidebar()}
      className={clsx(
        "h-8 w-8 p-1 rounded-r-md bg-slate-600 absolute top-1.5 sm:top-16 right-0 translate-x-[90%]",
        "transition-transform z-30 md:hidden opacity-50 hover:opacity-100",
        {
          "-translate-x-0 bg-white -scale-x-[1] text-gray-900":
            state.isSidebarOpen,
        },
      )}
    >
      <ChevronRightIcon />
    </button>
  );

  const { data: TVL, isLoading: isLoadingTVL } = useTVLQuery();
  const { data: rowanPrice, isLoading: isLoadingRowanPrice } =
    useRowanPriceQuery();

  const rowanStats = [
    {
      id: "tvl",
      icon: <LockIcon />,
      label: <>{isLoadingTVL ? "..." : formatNumberAsCurrency(TVL)} TVL</>,
    },
    {
      id: "price",
      icon: <RowanIcon />,
      label: (
        <>
          {" "}
          {isLoadingRowanPrice ? "..." : formatNumberAsCurrency(rowanPrice)} /
          ROWAN
        </>
      ),
    },
  ];

  return (
    <header className="bg-black p-2 sticky top-0">
      <div className="flex items-center gap-8 w-full justify-between">
        {handleBtn}
        <section className="grid place-items-center">
          <Link href="/">
            <a className="flex items-center">
              <Logo />
            </a>
          </Link>
        </section>
        <section className="md:w-[250px]">
          <GlobalSearch />
        </section>
        <nav className="flex items-center flex-1 gap-8 justify-center">
          <ul className="flex gap-2">
            {MENU_ITEMS.map(({ title, href, icon }) => (
              <li key={title} className="grid gap-2">
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
                    <span className="h-6 w-6 grid place-items-center text-gray-50 md:hidden">
                      {icon}
                    </span>
                    <span className="text-gray-200 font-semibold text-sm">
                      {title}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <section className="flex items-center gap-2 md:gap-4">
          <ul className="flex items-center gap-2">
            {rowanStats.map(({ id, icon, label }) => (
              <li key={id} className="flex items-center gap-3 p-2">
                <span className="h-6 w-6 grid place-items-center text-gray-50">
                  {icon}
                </span>
                <span className="text-gray-200 font-semibold text-xs tracking-widest">
                  {label}
                </span>
              </li>
            ))}
          </ul>
          <label
            className="flex items-center justify-between p-2"
            role="button"
          >
            <span className="sr-only">Dark mode</span>
            <ThemeSwitcher />
          </label>
        </section>
        <section className="flex gap-2 p-1">
          <WalletConnector />
        </section>
      </div>
    </header>
  );
};

export default Header;
