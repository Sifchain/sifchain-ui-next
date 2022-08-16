import { AsyncImage, SurfaceA } from "@sifchain/ui";
import clsx from "clsx";
import type { FC } from "react";
import { useQuery } from "react-query";

import { CardsGrid, GridCard } from "~/components/core";
import type { ProviderConfig } from "~/types";

function useProvidersQuery() {
  const query = useQuery(["providers"], async () => {
    const { default: file } = await import(
      "~/../public/config/providers/providers.json"
    );

    return file.providers as ProviderConfig[];
  });

  return query;
}

const Providers = () => {
  return (
    <div className="grid gap-8">
      <ProvidersSection title="Sifchain dex providers" />
    </div>
  );
};

const ProvidersSection: FC<{ title: string }> = (props) => {
  const { data: providers } = useProvidersQuery();

  return (
    <section className="grid gap-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl">{props.title}</h2>
      </header>
      <CardsGrid>
        {providers
          ?.filter((provider) => provider.featured)
          ?.sort((a, b) => a.displayName.localeCompare(b.displayName))
          .map((provider) => (
            <li key={provider.id}>
              <GridCard>
                <div className="flex items-center gap-2">
                  <figure className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-gray-750">
                    <AsyncImage
                      alt={`${provider.displayName} logo`}
                      className={clsx(
                        "h-8 w-8 overflow-hidden rounded-full p-0.5"
                      )}
                      src={provider.logoUrl}
                    />
                  </figure>
                  <h3 className="text-lg">{provider.displayName}</h3>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm">{provider.description}</p>
                </div>
                <div>
                  <a
                    className="text-indigo-400 underline"
                    href={provider.url}
                    rel="noopener noreferrer"
                  >
                    {provider.url}
                  </a>
                </div>
              </GridCard>
            </li>
          ))}
      </CardsGrid>
    </section>
  );
};

export default Providers;
