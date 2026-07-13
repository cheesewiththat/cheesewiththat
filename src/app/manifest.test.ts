import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "./manifest";

describe("site manifest", () => {
  it("references existing install icons", () => {
    const result = manifest();

    expect(result.name).toBe("Cheesewiththat");
    expect(result.start_url).toBe("/");
    expect(result.icons).toHaveLength(2);
    for (const icon of result.icons ?? []) {
      expect(existsSync(join(process.cwd(), "public", icon.src))).toBe(true);
    }
  });
});
