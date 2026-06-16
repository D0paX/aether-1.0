#ifndef AETHER_SRC_BROWSER_WEBUI_HANDLERS_AETHER_NAVIGATION_HANDLER_H_
#define AETHER_SRC_BROWSER_WEBUI_HANDLERS_AETHER_NAVIGATION_HANDLER_H_

#include <string>

#include "aether/src/browser/webui/mojom/navigation.mojom.h"
#include "base/memory/raw_ptr.h"
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/tabs/tab_strip_model_observer.h"
#include "content/public/browser/web_contents_observer.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"
#include "mojo/public/cpp/bindings/pending_remote.h"
#include "mojo/public/cpp/bindings/receiver.h"
#include "mojo/public/cpp/bindings/remote_set.h"

namespace content {
class NavigationHandle;
class Page;
}

class AetherNavigationHandler
    : public aether::mojom::NavigationHandler,
      public content::WebContentsObserver,
      public TabStripModelObserver {
 public:
  explicit AetherNavigationHandler(Browser* browser);
  ~AetherNavigationHandler() override;
  void BindReceiver(
      mojo::PendingReceiver<aether::mojom::NavigationHandler> receiver);

 private:
  // aether::mojom::NavigationHandler overrides
  void Navigate(const std::string& input) override;
  void GoBack() override;
  void GoForward() override;
  void Reload() override;
  void Stop() override;
  void GetNavigationState(GetNavigationStateCallback callback) override;
  void AddObserver(
      mojo::PendingRemote<aether::mojom::NavigationObserver> observer) override;

  // content::WebContentsObserver overrides
  void DidStartNavigation(content::NavigationHandle* navigation_handle) override;
  void PrimaryPageChanged(content::Page& page) override;
  void LoadProgressChanged(double progress) override;

  // TabStripModelObserver overrides
  void OnTabStripModelChanged(TabStripModel* tab_strip_model,
                              const TabStripModelChange& change,
                              const TabStripSelectionChange& selection) override;

  // Helpers
  aether::mojom::NavigationStatePtr BuildNavigationState();
  aether::mojom::SecurityLevel GetSecurityLevel();
  void NotifyObservers();
  void ObserveActiveTab();

  raw_ptr<Browser> browser_;
  mojo::Receiver<aether::mojom::NavigationHandler> receiver_{this};
  mojo::RemoteSet<aether::mojom::NavigationObserver> observers_;
};

#endif  // AETHER_SRC_BROWSER_WEBUI_HANDLERS_AETHER_NAVIGATION_HANDLER_H_
