import { BrowserBridge } from "./BrowserBridge";
import { isBrowserEnvironment } from "./environment";
import { RealBrowserBridge } from "./BrowserBridge.real";
import { MockBrowserBridge } from "./BrowserBridge.mock";

// Conditional check evaluates compile-time constant __AETHER_DEV__ in production
// allowing the bundler to tree-shake MockBrowserBridge from the bundle.
export const browserBridge: BrowserBridge =
  !isBrowserEnvironment() && (typeof __AETHER_DEV__ === "undefined" || __AETHER_DEV__)
    ? new MockBrowserBridge()
    : new RealBrowserBridge();
