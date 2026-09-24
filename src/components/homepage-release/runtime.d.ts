export interface HomepageRuntime {
  selectStory(index: number): void;
  selectPractice(index: number): void;
  selectDividend(mode: 'practice' | 'benefits' | 'return'): void;
  selectBenefit(index: number): void;
  destroy(): void;
}
export function mountHomepageRuntime(root: HTMLElement, options: { onStart: (route: 'home' | 'brain' | 'gtm') => void }): HomepageRuntime;
