/** Human runs after caching the exact PDF dependency. No network permission needed. */
import {
  PDF_MODULE,
  pdfText,
} from "../../supabase/functions/_shared/parts-research/documents.ts";
import { liveDependencies } from "./research-run.ts";
const bytes = await Deno.readFile(
  new URL(
    "../../supabase/functions/_shared/parts-research/fixtures/shareholder-letter.pdf",
    import.meta.url,
  ),
);
const text = await pdfText(bytes, liveDependencies());
if (!text.includes("revenue was $1.4 billion in Q3 2026")) {
  throw new Error("PDF fixture text did not match");
}
console.log(
  JSON.stringify({
    pdfParser: PDF_MODULE,
    fixture: "shareholder-letter.pdf",
    result: "pass",
  }),
);
