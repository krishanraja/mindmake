export function mountLiquidBrain(field: HTMLElement, options: {
  ideas: { id: string; x: number; y: number; settled: boolean }[];
  nodes: Map<string, HTMLButtonElement>;
  initial: string;
  reduced: boolean;
  onAdvance: (id: string) => void;
}): { select(id: string, byReader: boolean): void; destroy(): void };
