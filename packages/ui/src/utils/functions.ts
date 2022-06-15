export { default as debounce } from "lodash.debounce";
export { default as throttle } from "lodash.throttle";

let timeoutHandle = -1;

/**
 * Debounces a given callback using requestAnimationFrame
 * @param fn
 */
export function debounceRaf<T extends (...args: any[]) => void>(fn: T) {
  return (...args: any[]) => {
    window.clearTimeout(timeoutHandle);
    timeoutHandle = window.requestAnimationFrame(() => fn(...args));
  };
}
