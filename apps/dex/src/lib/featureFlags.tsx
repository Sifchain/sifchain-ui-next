import { useRouter } from "next/router";
import type { FC, PropsWithChildren, ReactNode } from "react";

import { useRedirectOnMount } from "~/hooks/useRedirectOnMount";

export type FlagsState = {
  features: {
    margin: boolean;
    "margin-standalone": boolean;
  };
};

export type FeatureFlags = keyof FlagsState["features"];

export function useFeatureFlags() {
  const rawFeatures = process.env["NEXT_PUBLIC_FEATURES"] ?? "";
  return new Set<FeatureFlags>(rawFeatures.split(/,(\s+)?/) as FeatureFlags[]);
}

export function useFeatureFlag(key: FeatureFlags) {
  const features = useFeatureFlags();

  return features.has(key);
}

type FeatureFlagProps = PropsWithChildren<{
  key: FeatureFlags;
  fallback?: ReactNode;
}>;

export const FeatureFlag: FC<FeatureFlagProps> = ({
  children,
  key,
  fallback = null,
}) => {
  const isFeatureOn = useFeatureFlag(key);

  return <>{isFeatureOn ? children : fallback}</>;
};

export function withRedirectOnMount<T>(
  InnerComponent: FC<T>,
  options: {
    redirectTo: string;
    redirectIf: (ctx: { flags: Set<FeatureFlags> }) => boolean;
    fallback?: ReactNode;
  },
) {
  function RedirectOnMount(innerProps: T) {
    const router = useRouter();

    const flags = useFeatureFlags();

    useRedirectOnMount(options.redirectTo, options.redirectIf({ flags }));

    return router.isReady ? (
      <InnerComponent {...innerProps} />
    ) : (
      options.fallback ?? <>...</>
    );
  }

  RedirectOnMount.displayName = `withRedirectOnMount(${InnerComponent.displayName})`;

  return RedirectOnMount;
}
