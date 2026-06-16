/**
 * Canonical check used throughout the WebUI to decide between
 * real and mock service implementations. Returns true when running
 * inside the compiled Aether browser under the chrome:// scheme.
 */
export function isBrowserEnvironment(): boolean {
  return window.location.protocol === "chrome:";
}
