import {
  BalanceIcon,
  ButtonGroup,
  ChangelogIcon,
  formatNumberAsCurrency,
  LockIcon,
  Logo,
  LogoFull,
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
    <header className="bg-black p-2 grid md:sticky top-0">
      <div className="grid md:flex items-center gap-8 w-full justify-between">
        <section className="grid place-items-center">
          <Link href="/">
            <a className="flex items-center">
              <Logo className="md:hidden" />
              <LogoFull className="hidden md:block h-12" />
            </a>
          </Link>
        </section>
        <section className="md:max-w-[250px]">
          <GlobalSearch />
        </section>
        <nav className="grid md:flex items-center flex-1 gap-8 justify-center">
          <ul className="grid gap-2 md:flex">
            {MENU_ITEMS.slice(0, 3).map(({ title, href, icon }) => (
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
            <li>...</li>
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
