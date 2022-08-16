import * as typescriptFetch from './generated/typescriptFetch';
import { Configuration, FetchAPI } from './generated/typescriptFetch';

export * from './generated/typescriptFetch';

type ApiFactoryKeyString = `${string}ApiFactory`;

type ApiFactoryKey = Extract<keyof typeof typescriptFetch, ApiFactoryKeyString>;

type TrimApiFactoryKey<T extends string> = T extends `${infer Prefix}ApiFactory`
  ? Prefix
  : T;

type ApiFactories = {
  [P in keyof typeof typescriptFetch as P extends ApiFactoryKeyString
    ? P
    : never]: typeof typescriptFetch[P];
};

export const createClient = (
  configuration?: Configuration,
  fetch?: FetchAPI,
  basePath?: string
) =>
  Object.fromEntries(
    Object.entries(typescriptFetch)
      .filter((entry): entry is [string, ApiFactories[keyof ApiFactories]] =>
        entry[0].endsWith('ApiFactory')
      )
      .map(([key, value]) => [key.replace('ApiFactory', ''), value] as const)
      .map(([key, value]) => [
        key.charAt(0).toLowerCase() + key.slice(1),
        value(configuration, fetch, basePath),
      ])
  ) as {
    [P in ApiFactoryKey as Uncapitalize<TrimApiFactoryKey<P>>]: ReturnType<
      typeof typescriptFetch[P]
    >;
  };
