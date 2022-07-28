/**
 * Minimal implementation of a Maybe monad
 * loosely based on https://github.com/patrickmichalina/typescript-monads/blob/master/src/maybe/maybe.ts
 */
export class Maybe<T> {
  private _value: T | undefined | null;

  constructor(value?: T | null) {
    this._value = value;
  }

  static of<T>(value: T) {
    return new Maybe(value);
  }

  valueOr<U>(defaultValue: U): T | U {
    if (this.isSome) {
      return this._value as NonNullable<T>;
    }

    return defaultValue;
  }

  get isSome() {
    return this._value !== undefined && this._value !== null;
  }

  get isNone() {
    return this._value === null || this._value === undefined;
  }

  map<U>(fn: (value: NonNullable<T>) => U) {
    if (this.isSome) {
      return Maybe.of(fn(this._value as NonNullable<T>));
    }

    return new Maybe<U>(undefined);
  }

  mapOr<U>(defaultValue: U, fn: (value: NonNullable<T>) => U): U {
    if (this.isSome) {
      return fn(this._value as NonNullable<T>);
    }

    return defaultValue;
  }

  //
}
