export type SafeKeyof<T> = T extends Record<string, any> ? keyof T : never;
