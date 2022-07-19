import { AsyncImage, SurfaceA } from "@sifchain/ui";
import clsx from "clsx";
import ky from "ky";
import type { FC } from "react";
import { useQuery } from "react-query";
import type { ProviderConfig } from "~/types";

function useProvidersQuery() {
  const query = useQuery(["providers"], () =>
    ky.get(`/api/providers`).json<ProviderConfig[]>(),
  );

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
      <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-3 6xl:grid-cols-4">
        {providers
          ?.filter((provider) => provider.featured)
          ?.sort((a, b) => a.displayName.localeCompare(b.displayName))
          .map((provider) => (
            <li key={provider.id}>
              <SurfaceA className="min-h-[120px] grid gap-2">
                <div className="flex items-center gap-2">
                  <figure className="h-8 w-8 ring-2 ring-gray-750 rounded-full overflow-hidden">
                    <AsyncImage
                      alt={`${provider.displayName} logo`}
                      className={clsx(
                        "p-0.5 rounded-full overflow-hidden h-8 w-8",
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
              </SurfaceA>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default Providers;
