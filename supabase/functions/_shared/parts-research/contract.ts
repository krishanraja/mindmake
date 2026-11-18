import keys from "../../../../project-documentation/research-pack-contract.keys.json" with {
  type: "json",
};
/** Buyer-facing v1 + v1.1/v1.2 keys; receipt metadata never belongs here. */
export const REQUIRED_FACT_KEYS: readonly string[] = keys.fact.required;
export const ALLOWED_FACT_KEYS: readonly string[] = [
  ...keys.fact.required,
  ...keys.fact.optional,
];
