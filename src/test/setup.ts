import "@testing-library/jest-dom/vitest";

// jsdom implements neither observer. Scroll-reveal and sticky-nav hooks
// construct both on mount, so without these the console fills with
// ReferenceErrors that bury real assertion failures.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: NoopObserver,
});
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: NoopObserver,
});

// Mock window.matchMedia for next-themes and responsive hooks
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
