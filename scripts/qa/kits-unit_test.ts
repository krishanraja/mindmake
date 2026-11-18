import { kitTests } from "./kits-test-cases.ts";
for (const [name, test] of kitTests) Deno.test(name, test);
