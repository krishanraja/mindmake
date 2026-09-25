export interface HomepageRuntime {
  selectStory(index: number): void;
  destroy(): void;
}
export function mountHomepageRuntime(root: HTMLElement, options: { onStart: (route: 'home' | 'brain' | 'gtm') => void }): HomepageRuntime;
