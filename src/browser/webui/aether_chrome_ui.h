// Aether Browser — Top-Chrome WebUI Controller
// Hosts the Aether chrome (TitleBar, and eventually TabBar/AddressBar/
// Sidebar) as a persistent WebUI surface inside BrowserView. See
// .aether/decisions/ADR-002-top-chrome-webui-hosting.md for the architecture
// rationale. Batch 08 replaces the native tab strip and integrates this
// surface into the primary layout position.

#ifndef BROWSER_WEBUI_AETHER_CHROME_UI_H_
#define BROWSER_WEBUI_AETHER_CHROME_UI_H_

#include "chrome/browser/ui/webui/top_chrome/top_chrome_web_ui_controller.h"
#include "aether/src/browser/webui/mojom/window_controls.mojom.h"
#include "aether/src/browser/webui/mojom/tab_manager.mojom.h"
#include "aether/src/browser/webui/handlers/aether_tab_manager_handler.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"

class AetherWindowControlsHandler;

class AetherChromeUI : public TopChromeWebUIController {
 public:
  explicit AetherChromeUI(content::WebUI* web_ui);
  ~AetherChromeUI() override;

  AetherChromeUI(const AetherChromeUI&) = delete;
  AetherChromeUI& operator=(const AetherChromeUI&) = delete;

  void BindInterface(
      mojo::PendingReceiver<aether::mojom::WindowControls> receiver);
  void BindInterface(
      mojo::PendingReceiver<aether::mojom::TabManager> receiver);

 private:
  std::unique_ptr<AetherWindowControlsHandler> window_controls_handler_;
  std::unique_ptr<AetherTabManagerHandler> tab_manager_handler_;
};

#endif  // BROWSER_WEBUI_AETHER_CHROME_UI_H_
