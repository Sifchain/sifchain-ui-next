/**
 * Minimal implementation of a Maybe monad
 * loosely based on https://github.com/patrickmichalina/typescript-monads/blob/master/src/maybe/maybe.ts
 */
export class Maybe<T> {
  constructor(private readonly value?: T | null) {}

  public static of<T>(value: T) {
    return new Maybe(value);
  }

  public valueOr<U>(defaultValue: U): T | U {
    if (this.isSome) {
      return this.value as NonNullable<T>;
    }

    return defaultValue;
  }

  public get isSome() {
    return this.value !== undefined;
  }

  public get isNone() {
    return this.value === null || this.value === undefined;
  }

  public map<U>(fn: (value: NonNullable<T>) => U) {
    if (this.isSome) {
      return Maybe.of(fn(this.value as NonNullable<T>));
    }

    return new Maybe<U>(undefined);
  }

  public mapOr<U>(defaultValue: U, fn: (value: NonNullable<T>) => U): U {
    if (this.isSome) {
      return fn(this.value as NonNullable<T>);
    }

    return defaultValue;
  }
}
