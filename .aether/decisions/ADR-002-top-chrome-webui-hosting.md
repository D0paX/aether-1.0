# ADR-002 — Top Chrome WebUI Hosting

- Status: Accepted
- Date: 2026-06-15
- Deciders: Founding engineering team

## Context

Aether's approved design guidelines specify a custom, premium browser interface built in React and TypeScript. In standard Chromium and Brave, the browser chrome (window title bar, tab strip, toolbar, omnibox, and sidebar) is constructed using native C++ views (e.g. `TopContainerView`, `TabStrip`, `ToolbarView`).

To achieve Aether's target interface, we must host our React-based WebUI page (`chrome://aether-webui/`) within the native Chromium browser frame. Prior art within Chromium includes the "Top Chrome WebUI" pattern, which embeds WebUI-based content inside native C++ View containers:
- **Tab Search**: Displays a bubble hosted via `TabSearchBubbleView` (a subclass of `views::BubbleDialogDelegateView`), managed by `TabSearchBubbleHost`, and wrapping `WebUIContentsWrapperT<TabSearchUI>`.
- **Side Panel**: Embeds WebUI contents inside a `views::WebView` utilizing `SidePanelWebUIViewWrapper` to manage the underlying `content::WebContents` lifecycle.

Both systems rely on the C++ class `WebUIContentsWrapper` to bridge the native Views framework and the web-based rendering layers.

## Decision

Aether will implement a hybrid architecture where the React-based chrome WebUI is hosted natively inside the Chromium window:

1. **WebUI Controller**: The [AetherWebUITestUI](file:///e:/Aether/src/browser/webui/aether_webui_test_ui.h#L8) class (declared in [aether_webui_test_ui.h](file:///e:/Aether/src/browser/webui/aether_webui_test_ui.h) and implemented in [aether_webui_test_ui.cc](file:///e:/Aether/src/browser/webui/aether_webui_test_ui.cc)) inherits from `ui::MojoWebUIController` to handle the `chrome://aether-webui/` host and expose Mojo interfaces.
2. **WebContents Lifecycle Wrapper**: We will utilize `WebUIContentsWrapperT<AetherWebUITestUI>` (inheriting from `WebUIContentsWrapper`) to handle creation, preloading, and lifetime management of the `content::WebContents` instance loading `chrome://aether-webui/`.
3. **Views Container**: We will implement a custom C++ View class, `AetherChromeWebUIView`, subclassing `views::WebView`. This view will hold the `WebContents` and serve as the visual canvas for our React frontend inside the native hierarchy.
4. **Insertion Point**: In `BrowserView::InitViews()` (located in [browser_view.cc](file:///C:/src/brave-browser/src/chrome/browser/ui/views/frame/browser_view.cc)), we will instantiate `AetherChromeWebUIView` and add it as a child view of the main `BrowserView`. The `BrowserViewLayout` manager will position this view at the very top of the window frame.

## Scope Boundary for Batch 07

To manage engineering risk, the migration is structured incrementally:
- In Batch 07, the native `TabStrip` and `ToolbarView` remain functional and visible.
- The `AetherChromeWebUIView` sits at the top of the client area, loading our React WebUI to render the custom draggable title bar.
- The React title bar handles window state controls (minimize, maximize, close buttons). Clicking these buttons triggers Mojo IPC calls that route to the C++ controller, which updates the native widget.
- Full replacement of the native tab strip and toolbar is deferred to Batch 08 and Batch 09.

## Alternatives Considered

### Native C++ Views
Traditional approach. Writing the browser chrome as native C++ views.
- **Why Rejected**: High development friction, slower iteration cadence, difficulties in implementing modern animated aesthetics (Framer Motion equivalent in C++ views is highly complex), and the lack of a unified design system. A React-based WebUI chrome ensures consistent typography, colors, and layout sharing the same tokens file.

## Consequences

### Positive
- Single UI technology stack (React 19 + TypeScript) for all browser chrome.
- Seamless design changes via a single [tokens.css](file:///e:/Aether/src/webui/src/styles/tokens.css) file.
- Fast iteration cycle enabled by the Vite-powered WebUI build pipeline from Batch 06.

### Negative
- High architectural complexity and engineering risk inside the initial hosting layers.
- Vulnerability to upstream changes: If a future Brave/Chromium rebase alters `BrowserView`, `BrowserViewLayout`, or `WebUIContentsWrapper`, this integration will require manual updates.

## Review Trigger

This ADR and its C++ hosting implementation must be reviewed and updated if:
- An upstream Chromium/Brave rebase refactors, renames, or replaces the `BrowserView` view hierarchy or the `WebUIContentsWrapper` infrastructure.
- We encounter performance bottlenecks (e.g. latency in window dragging or resizing) due to hosting the top title bar in WebUI.
