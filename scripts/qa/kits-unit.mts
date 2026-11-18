/** Same cases as Vitest, runnable without a worker or network dependency. */
import { kitTests } from "./kits-test-cases.ts";
let failures = 0;
for (const [name, test] of kitTests) {
  try { await test(); console.log(`PASS ${name}`); }
  catch (error) { failures++; console.error(`FAIL ${name}`, error); }
}
console.log(JSON.stringify({ cases: kitTests.length, failures, providers: "mocked", sends: 0 }));
process.exitCode = failures ? 1 : 0;
