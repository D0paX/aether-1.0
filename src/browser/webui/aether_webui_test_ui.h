#ifndef BROWSER_WEBUI_AETHER_WEB_UI_TEST_UI_H_
#define BROWSER_WEBUI_AETHER_WEB_UI_TEST_UI_H_

#include "content/public/browser/web_ui_controller.h"

// C++ WebUI controller for chrome://aether-webui/.
// Serves Aether's React-based WebUI frontend in the compiled browser binary.
class AetherWebUITestUI : public content::WebUIController {
 public:
  explicit AetherWebUITestUI(content::WebUI* web_ui);
  ~AetherWebUITestUI() override;

  AetherWebUITestUI(const AetherWebUITestUI&) = delete;
  AetherWebUITestUI& operator=(const AetherWebUITestUI&) = delete;
};

#endif  // BROWSER_WEBUI_AETHER_WEB_UI_TEST_UI_H_
