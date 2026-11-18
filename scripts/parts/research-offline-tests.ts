/** Fallback for Windows sandboxes where Deno's test reporter pipe cannot open.
 * Executes the identical test bodies in process. It does not replace deno test's
 * resource sanitiser or the required release run of deno test.
 */
const cases: { name: string; fn: () => unknown }[] = [];
const original = Deno.test;
Object.defineProperty(Deno, "test", {
  value: (name: string, fn: () => unknown) => cases.push({ name, fn }),
  configurable: true,
});
try {
  await import(
    "../../supabase/functions/_shared/parts-research/research_test.ts"
  );
  await import(
    "../../supabase/functions/_shared/parts-research/identity_test.ts"
  );
  await import(
    "../../supabase/functions/_shared/parts-research/gather_test.ts"
  );
  await import("../../supabase/functions/_shared/enrich/llm_test.ts");
  await import("../../supabase/functions/_shared/parts-research/v12_test.ts");
  await import(
    "../../supabase/functions/_shared/parts-research/extraction_test.ts"
  );
  await import("../../supabase/functions/_shared/parts-research/uk_test.ts");
  await import("../../supabase/functions/_shared/parts-research/r20_test.ts");
  await import("../../supabase/functions/_shared/parts-research/r21_test.ts");
  await import("../../supabase/functions/_shared/parts-research/issue1_test.ts");
} finally {
  Object.defineProperty(Deno, "test", { value: original, configurable: true });
}
let failures = 0;
for (const test of cases) {
  try {
    await test.fn();
    console.log(`PASS ${test.name}`);
  } catch (error) {
    failures++;
    console.error(
      `FAIL ${test.name}: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    );
  }
}
console.log(
  JSON.stringify({
    cases: cases.length,
    failures,
    networkPermission: "not granted",
    runner: "in-process fallback; no Deno test resource sanitiser",
  }),
);
Deno.exitCode = failures ? 1 : 0;
