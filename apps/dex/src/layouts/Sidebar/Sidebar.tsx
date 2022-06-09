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

const ENV = process.env["APP_ENV"] ?? "betanet";

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

const Aside = () => {
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
    <aside
      className={clsx(
        [
          "fixed w-full md:max-w-[280px] h-screen transition-transform ease",
          "bg-gray-900 p-4 sm:shadow-lg shadow-slate-900",
        ],
        {
          "-translate-x-[100%]": !state.isSidebarOpen,
          "md:sticky md:top-0": state.isSidebarOpen,
        },
      )}
    >
      <div className="flex flex-col gap-8 h-full">
        {handleBtn}
        <section className="w-full grid place-items-center py-8 md:py-10 gap-2">
          <Link href="/">
            <a className="flex items-center">
              <Logo />
            </a>
          </Link>
          <span className="text-white font-mono uppercase">{ENV}</span>
        </section>
        <section>
          <GlobalSearch />
        </section>
        <section className="flex flex-1">
          <nav className="w-full">
            <ul className="grid gap-2">
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
                      <span className="h-6 w-6 grid place-items-center">
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
        </section>
        <section className="grid gap-2 md:gap-4">
          <ul className="grid">
            {rowanStats.map(({ id, icon, label }) => (
              <li key={id} className="flex items-center gap-3 p-2">
                <span className="h-6 w-6 grid place-items-center">{icon}</span>
                <span className="text-gray-200 font-semibold text-sm tracking-widest">
                  {label}
                </span>
              </li>
            ))}
          </ul>
          <label
            className="flex items-center justify-between p-2"
            role="button"
          >
            <div className="flex items-center gap-3">
              <span className="grid place-items-center text-gray-50">
                <MoonIcon className="h-6 w-6 scale-90 origin-center" />
              </span>
              <span className="text-gray-200 font-semibold text-sm tracking-widest">
                Dark mode
              </span>
            </div>
            <ThemeSwitcher />
          </label>
        </section>
        <section className="grid gap-2">
          <WalletConnector />
          <div className="text-center text-sm text-gray-300 font-mono p-1">
            v2.2.105 © {new Date().getFullYear()} Sifchain
          </div>
        </section>
      </div>
    </aside>
  );
};

export default Aside;
