export function runCatching<TValue, TError = unknown>(
  func: () => TValue,
): [undefined, Awaited<TValue>] | [TError, undefined];
export function runCatching<TValue, TError = unknown>(
  asyncFunc: () => PromiseLike<TValue>,
): Promise<[undefined, Awaited<TValue>] | [TError, undefined]>;
export function runCatching<TValue, TError = unknown>(
  func: () => TValue,
):
  | ([undefined, TValue] | [TError, undefined])
  | Promise<[undefined, Awaited<TValue>] | [TError, undefined]> {
  try {
    const returnValue = func();

    return returnValue instanceof Promise
      ? returnValue
          .then<[undefined, Awaited<TValue>]>((x) => [undefined, x])
          .catch<[TError, undefined]>((error) => [error as TError, undefined])
      : [undefined, returnValue];
  } catch (error: unknown) {
    return [error as TError, undefined];
  }
}
