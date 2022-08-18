import type { FC, PropsWithChildren } from "react";

export type ComposeProvidersProps = PropsWithChildren<{
  providers: FC<PropsWithChildren>[];
}>;

export const ComposeProviders: FC<ComposeProvidersProps> = ({ providers, children }) => (
  <>
    {providers.reduce(
      (acc, Provider) => (
        <Provider>{acc}</Provider>
      ),
      children,
    )}
  </>
);
