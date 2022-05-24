import { IAsset } from "@sifchain/core";
import ky from "ky";
import { prop } from "rambda";
import { indexBy } from "ramda";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";

export default function useAssetsQuery(network: "ethereum" | "sifchain") {
  const { data: env } = useDexEnvironment();
  const { data, ...query } = useQuery(
    ["assetlist", env?.kind],
    async () => {
      if (!env) {
        return;
      }

      return ky
        .get(`${env.registryUrl}/api/${network}/${env?.kind}`)
        .json<IAsset[]>();
    },
    { enabled: Boolean(env) },
  );

  const indices = useMemo(() => {
    if (!data || !query.isSuccess) {
      return {
        indexedBySymbol: {},
        indexedByDisplaySymbol: {},
      };
    }

    return {
      indexedBySymbol: indexBy(prop("symbol"), data),
      indexedByDisplaySymbol: indexBy(prop("displaySymbol"), data),
    };
  }, [data]);

  return { data, ...query, ...indices };
}
