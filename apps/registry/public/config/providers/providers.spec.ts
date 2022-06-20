import { describe, it, expect } from "vitest";
import { validate } from "jsonschema";

import schema from "./_providers.schema.json";

describe("providers", () => {
  it("should match the json schema", async () => {
    const target = await import("./providers.json");

    expect(validate(target, schema).valid).toBe(true);
  });
});
