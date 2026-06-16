#ifndef AETHER_SRC_BROWSER_WEBUI_HANDLERS_AETHER_TAB_MANAGER_HANDLER_H_
#define AETHER_SRC_BROWSER_WEBUI_HANDLERS_AETHER_TAB_MANAGER_HANDLER_H_

#include <vector>
#include <string>

#include "base/memory/raw_ptr.h"
#include "chrome/browser/ui/tabs/tab_strip_model_observer.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"
#include "mojo/public/cpp/bindings/pending_remote.h"
#include "mojo/public/cpp/bindings/receiver.h"
#include "mojo/public/cpp/bindings/remote_set.h"
#include "aether/src/browser/webui/mojom/tab_manager.mojom.h"

class Browser;
class TabStripModel;

class AetherTabManagerHandler : public aether::mojom::TabManager,
                                public TabStripModelObserver {
 public:
  explicit AetherTabManagerHandler(Browser* browser, TabStripModel* tab_strip_model);
  ~AetherTabManagerHandler() override;

  void BindReceiver(
      mojo::PendingReceiver<aether::mojom::TabManager> receiver);

  // aether::mojom::TabManager overrides
  void GetAllTabs(GetAllTabsCallback callback) override;
  void GetAllTabGroups(GetAllTabGroupsCallback callback) override;
  void CreateTab(const std::string& url, CreateTabCallback callback) override;
  void CloseTab(int32_t tab_id) override;
  void ActivateTab(int32_t tab_id) override;
  void MoveTab(int32_t tab_id, int32_t new_index) override;
  void SetTabPinned(int32_t tab_id, bool pinned) override;
  void DuplicateTab(int32_t tab_id, DuplicateTabCallback callback) override;
  void AddObserver(
      mojo::PendingRemote<aether::mojom::TabManagerObserver> observer) override;

  // TabStripModelObserver overrides
  void OnTabStripModelChanged(
      TabStripModel* tab_strip_model,
      const TabStripModelChange& change,
      const TabStripSelectionChange& selection) override;

 private:
  // Converts the WebContents at |index| to an AetherTab mojom struct.
  aether::mojom::AetherTabPtr TabAtIndex(int index);

  // Builds the full tab list from current TabStripModel state.
  std::vector<aether::mojom::AetherTabPtr> BuildTabList();

  // Returns the index of the tab with the given session ID,
  // or TabStripModel::kNoTab if not found.
  int FindTabIndexById(int32_t tab_id);

  // Notifies all registered observers with the full current tab list.
  void NotifyTabsChanged();

  raw_ptr<Browser> browser_;
  raw_ptr<TabStripModel> tab_strip_model_;
  mojo::Receiver<aether::mojom::TabManager> receiver_{this};
  mojo::RemoteSet<aether::mojom::TabManagerObserver> observers_;
};

#endif  // AETHER_SRC_BROWSER_WEBUI_HANDLERS_AETHER_TAB_MANAGER_HANDLER_H_
