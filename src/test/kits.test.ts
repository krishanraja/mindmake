import { afterAll, beforeAll, describe, it, vi } from "vitest";
import { webcrypto } from "node:crypto";
import { kitTests } from "../../scripts/qa/kits-test-cases";

describe("kits catalogue and commerce with mocked providers", () => {
  beforeAll(() => vi.stubGlobal("crypto", webcrypto));
  afterAll(() => vi.unstubAllGlobals());
  for (const [name, test] of kitTests) it(name, test);
});
