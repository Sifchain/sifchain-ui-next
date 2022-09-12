import { useRouter } from "next/router";
import type { FC, PropsWithChildren, ReactNode } from "react";

export type FlagsState = {
  features: {
    margin: boolean;
    "margin-standalone": boolean;
  };
};

export type FeatureFlags = keyof FlagsState["features"];

export function getFeatureFlags() {
  const rawFeatures = process.env["NEXT_PUBLIC_FEATURES"] ?? "";
  return new Set<FeatureFlags>(rawFeatures.split(/,/) as FeatureFlags[]);
}

export function hasFeatureFlag(key: FeatureFlags) {
  const features = getFeatureFlags();
  return features.has(key);
}

export function useFeatureFlags() {
  return getFeatureFlags();
}

export function useFeatureFlag(key: FeatureFlags) {
  return hasFeatureFlag(key);
}

type FeatureFlagProps = PropsWithChildren<{
  key: FeatureFlags;
  fallback?: ReactNode;
}>;

export const FeatureFlag: FC<FeatureFlagProps> = ({ children, key, fallback = null }) => {
  const isFeatureOn = useFeatureFlag(key);

  return <>{isFeatureOn ? children : fallback}</>;
};

export function withRedirectOnMount(
  InnerComponent: FC,
  options: {
    redirectTo: string;
    redirectIf: (ctx: { flags: Set<FeatureFlags> }) => boolean;
    fallback?: ReactNode;
  },
) {
  function RedirectOnMount(innerProps: any) {
    const router = useRouter();

    const flags = useFeatureFlags();

    if (options.redirectIf({ flags })) {
      router.push(options.redirectTo);
      return options.fallback ?? <>...</>;
    }

    return <InnerComponent {...innerProps} />;
  }

  RedirectOnMount.displayName = `withRedirectOnMount(${InnerComponent.displayName})`;

  return RedirectOnMount;
}
