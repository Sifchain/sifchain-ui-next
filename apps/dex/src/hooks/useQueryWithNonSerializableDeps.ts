import { useChangedEffect } from "@sifchain/utils/react";
import {
  DefinedUseQueryResult,
  parseQueryArgs,
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type { DependencyList } from "react";

// @ts-ignore
export function useQueryWithNonQueryKeyDeps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "initialData"> & {
    initialData?: () => undefined;
  },
  deps?: DependencyList,
): UseQueryResult<TData, TError>;

export function useQueryWithNonQueryKeyDeps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "initialData"> & {
    initialData: TQueryFnData | (() => TQueryFnData);
  },
  deps?: DependencyList,
): DefinedUseQueryResult<TData, TError>;

export function useQueryWithNonQueryKeyDeps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  deps?: DependencyList,
): UseQueryResult<TData, TError>;

export function useQueryWithNonQueryKeyDeps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "initialData"> & {
    initialData?: () => undefined;
  },
  deps?: DependencyList,
): UseQueryResult<TData, TError>;

export function useQueryWithNonQueryKeyDeps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "initialData"> & {
    initialData: TQueryFnData | (() => TQueryFnData);
  },
  deps?: DependencyList,
): DefinedUseQueryResult<TData, TError>;

export function useQueryWithNonQueryKeyDeps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">,
  deps?: DependencyList,
): UseQueryResult<TData, TError>;

export function useQueryWithNonQueryKeyDeps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn" | "initialData"> & {
    initialData?: () => undefined;
  },
  deps?: DependencyList,
): UseQueryResult<TData, TError>;

export function useQueryWithNonQueryKeyDeps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn" | "initialData"> & {
    initialData: TQueryFnData | (() => TQueryFnData);
  },
  deps?: DependencyList,
): DefinedUseQueryResult<TData, TError>;

export function useQueryWithNonQueryKeyDeps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn">,
  deps?: DependencyList,
): UseQueryResult<TData, TError>;

export function useQueryWithNonQueryKeyDeps<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  arg1: TQueryKey | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg2?: QueryFunction<TQueryFnData, TQueryKey> | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg3?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  deps?: DependencyList,
): UseQueryResult<TData, TError> {
  const parsedOptions = parseQueryArgs(arg1, arg2, arg3);

  const query = useQuery(parsedOptions);

  useChangedEffect(() => {
    // query.remove();
  }, [query.remove, ...(deps ?? [])]);

  return query;
}
