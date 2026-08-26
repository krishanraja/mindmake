import "@testing-library/jest-dom/vitest";

// Node 25 exposes an incomplete global localStorage unless it is launched with
// a persistence file. Vitest keeps that object when it installs jsdom, so the
// browser API exists but has none of the Storage methods. Use a deterministic,
// in-memory Storage implementation in tests. This affects the test environment
// only; application code still uses the browser's native localStorage.
const storedValues = new Map<string, string>();
const testLocalStorage: Storage = {
  get length() {
    return storedValues.size;
  },
  clear() {
    storedValues.clear();
  },
  getItem(key) {
    return storedValues.get(String(key)) ?? null;
  },
  key(index) {
    return Array.from(storedValues.keys())[index] ?? null;
  },
  removeItem(key) {
    storedValues.delete(String(key));
  },
  setItem(key, value) {
    storedValues.set(String(key), String(value));
  },
};

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: testLocalStorage,
});

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
