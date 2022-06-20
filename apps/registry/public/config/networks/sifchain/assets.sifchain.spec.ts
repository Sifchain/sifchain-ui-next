import { describe, it, expect } from "vitest";
import { validate } from "jsonschema";

import schema from "./_assets.schema.json";

describe("assets.sifchain", () => {
  ["localnet", "devnet", "testnet", "mainnet"].forEach((env) => {
    it(`should match the json schema for env (${env})`, async () => {
      const target = await import(`./assets.sifchain.${env}.json`);

      expect(validate(target, schema).valid).toBe(true);
    });
  });
});
