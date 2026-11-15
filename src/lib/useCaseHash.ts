import { resultById, useCases, type ResultId, type UseCaseId } from "@/data/useCases";

/**
 * The use case a link fragment names on /case-studies: `#c-11`, or the older
 * result fragments `#story=<result>` (with or without `&phase=…`) and
 * `#record-<result>`, which live links on the homepage and product pages still
 * carry. Anything else names no use case.
 */
export function caseFromHash(hash: string): UseCaseId | undefined {
  const direct = /^#c-(\d{2})$/i.exec(hash);
  if (direct) {
    const id = `C-${direct[1]}` as UseCaseId;
    return useCases.some((entry) => entry.id === id) ? id : undefined;
  }
  const legacy = /^#(?:story=([a-z-]+)(?:&phase=[a-z]+)?|record-([a-z-]+))$/.exec(hash);
  const result = legacy?.[1] ?? legacy?.[2];
  if (!result) return undefined;
  try {
    return resultById(result as ResultId).useCase;
  } catch {
    return undefined;
  }
}

/** The fragment a use case lives at: `#c-11`. */
export const caseAnchor = (id: UseCaseId) => id.toLowerCase();
