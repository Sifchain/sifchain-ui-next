export type SafeKeyof<T> = T extends Record<string, unknown> ? keyof T : never;
