import type { PropsWithChildren } from "react";
import clsx from "clsx";

import { RacetrackSpinnerIcon } from "../icons";

export function FlashMessage({
  size,
  className,
  children = "Loading...",
}: PropsWithChildren<{
  size?: "full-page";
  className?: string;
}>) {
  const sizeStyles =
    size === "full-page"
      ? "bg-gray-850 flex h-full items-center justify-center p-8 text-sm text-gray-100"
      : "rounded-lg bg-yellow-100 p-4 text-sm text-yellow-700";
  return (
    <div className={clsx(sizeStyles, className)} role="alert">
      {children}
    </div>
  );
}

export function FlashMessageAccountNotWhitelisted({ className }: { className?: string }) {
  const styles = "rounded-lg bg-yellow-100 p-4 text-sm text-yellow-700";
  return (
    <div className={clsx(styles, className)} role="alert">
      <span>Sorry! Your account has not yet been approved for margin trading.</span>
    </div>
  );
}

export function FlashMessage5xxError({ size, className }: { size?: "full-page"; className?: string }) {
  const sizeStyles =
    size === "full-page"
      ? "bg-gray-850 flex h-full items-center justify-center p-8 text-sm text-gray-100"
      : "rounded-lg p-4 text-sm text-red-700 bg-red-100";
  return (
    <div className={clsx(sizeStyles, className)} role="alert">
      Ooops! Something wrong happened, try again later.
    </div>
  );
}

export function FlashMessageLoading({
  size,
  className,
  text = "Loading...",
}: {
  size?: "full-page";
  className?: string;
  text?: string;
}) {
  const sizeStyles =
    size === "full-page"
      ? "bg-gray-850 flex h-full items-center justify-center p-8 text-sm text-gray-100"
      : "rounded-lg bg-yellow-100 p-4 text-sm text-yellow-700";
  return (
    <div className={clsx("flex flex-row items-center justify-center", sizeStyles, className)} role="alert">
      <RacetrackSpinnerIcon className="mr-1 text-2xl" />
      {text}
    </div>
  );
}

export function FlashMessageConnectSifChainWallet({ size, className }: { size?: "full-page"; className?: string }) {
  const sizeStyles =
    size === "full-page"
      ? "bg-gray-850 flex h-full items-center justify-center p-8 text-sm text-gray-100"
      : "rounded-lg bg-blue-100 p-4 text-center text-sm text-blue-700";
  return (
    <div className={clsx(sizeStyles, className)} role="alert">
      Connect your Sifchain wallet
    </div>
  );
}

export function FlashMessageConnectSifChainWalletError({
  size,
  className,
}: {
  size?: "full-page";
  className?: string;
}) {
  const sizeStyles =
    size === "full-page"
      ? "bg-gray-850 flex h-full items-center justify-center p-8 text-sm text-gray-100"
      : "rounded-lg text-red-700 bg-red-100 text-center p-4 text-sm";
  return (
    <div className={clsx(sizeStyles, className)} role="alert">
      Unable to connect your Sifchain wallet.
    </div>
  );
}

export function FlashMessageConnectSifChainWalletLoading({
  size,
  className,
}: {
  size?: "full-page";
  className?: string;
}) {
  const sizeStyles =
    size === "full-page"
      ? "bg-gray-850 flex h-full items-center justify-center p-8 text-sm text-gray-100"
      : "rounded-lg bg-yellow-100 p-4 text-sm text-yellow-700";
  return (
    <div className={clsx("flex flex-row items-center justify-center", sizeStyles, className)} role="alert">
      <RacetrackSpinnerIcon className="mr-1 text-2xl" /> Connecting Sifchain wallet...
    </div>
  );
}
