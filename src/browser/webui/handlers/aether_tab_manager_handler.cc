#include "aether/src/browser/webui/handlers/aether_tab_manager_handler.h"

#include "base/strings/utf_string_conversions.h"
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_commands.h"
#include "chrome/browser/ui/browser_navigator.h"
#include "chrome/browser/ui/browser_navigator_params.h"
#include "chrome/browser/ui/tabs/tab_strip_model.h"
#include "chrome/browser/ui/tabs/tab_strip_user_gesture_details.h"
#include "chrome/common/webui_url_constants.h"
#include "components/sessions/content/session_tab_helper.h"
#include "content/public/browser/web_contents.h"

AetherTabManagerHandler::AetherTabManagerHandler(Browser* browser,
                                                 TabStripModel* tab_strip_model)
    : browser_(browser), tab_strip_model_(tab_strip_model) {
  tab_strip_model_->AddObserver(this);
}

AetherTabManagerHandler::~AetherTabManagerHandler() {
  tab_strip_model_->RemoveObserver(this);
}

void AetherTabManagerHandler::BindReceiver(
    mojo::PendingReceiver<aether::mojom::TabManager> receiver) {
  receiver_.reset();
  receiver_.Bind(std::move(receiver));
}

void AetherTabManagerHandler::GetAllTabs(GetAllTabsCallback callback) {
  std::move(callback).Run(BuildTabList());
}

void AetherTabManagerHandler::GetAllTabGroups(GetAllTabGroupsCallback callback) {
  std::vector<aether::mojom::AetherTabGroupPtr> groups;
  std::move(callback).Run(std::move(groups));
}

void AetherTabManagerHandler::CreateTab(const std::string& url,
                                        CreateTabCallback callback) {
  std::string target_url = url.empty() ? chrome::kChromeUINewTabURL : url;
  NavigateParams params(browser_, GURL(target_url), ui::PAGE_TRANSITION_LINK);
  params.disposition = WindowOpenDisposition::NEW_FOREGROUND_TAB;
  Navigate(&params);

  int32_t new_tab_id = -1;
  if (params.navigated_or_inserted_contents) {
    new_tab_id = sessions::SessionTabHelper::IdForTab(
                     params.navigated_or_inserted_contents)
                     .id();
  }
  std::move(callback).Run(new_tab_id);
}

void AetherTabManagerHandler::CloseTab(int32_t tab_id) {
  int index = FindTabIndexById(tab_id);
  if (index != TabStripModel::kNoTab) {
    tab_strip_model_->CloseWebContentsAt(index, TabCloseTypes::CLOSE_USER_GESTURE);
  }
}

void AetherTabManagerHandler::ActivateTab(int32_t tab_id) {
  int index = FindTabIndexById(tab_id);
  if (index != TabStripModel::kNoTab) {
    tab_strip_model_->ActivateTabAt(
        index,
        TabStripUserGestureDetails(TabStripUserGestureDetails::GestureType::kOther));
  }
}

void AetherTabManagerHandler::MoveTab(int32_t tab_id, int32_t new_index) {
  int index = FindTabIndexById(tab_id);
  if (index != TabStripModel::kNoTab) {
    tab_strip_model_->MoveWebContentsAt(index, new_index, false);
  }
}

void AetherTabManagerHandler::SetTabPinned(int32_t tab_id, bool pinned) {
  int index = FindTabIndexById(tab_id);
  if (index != TabStripModel::kNoTab) {
    tab_strip_model_->SetTabPinned(index, pinned);
  }
}

void AetherTabManagerHandler::DuplicateTab(int32_t tab_id,
                                           DuplicateTabCallback callback) {
  int index = FindTabIndexById(tab_id);
  int32_t new_tab_id = -1;
  if (index != TabStripModel::kNoTab) {
    if (browser_) {
      chrome::DuplicateTab(browser_);
      content::WebContents* new_wc = tab_strip_model_->GetActiveWebContents();
      if (new_wc) {
        new_tab_id = sessions::SessionTabHelper::IdForTab(new_wc).id();
      }
    } else {
      content::WebContents* wc = tab_strip_model_->GetWebContentsAt(index);
      if (wc) {
        NavigateParams params(browser_, wc->GetLastCommittedURL(), ui::PAGE_TRANSITION_LINK);
        params.disposition = WindowOpenDisposition::NEW_FOREGROUND_TAB;
        Navigate(&params);
        if (params.navigated_or_inserted_contents) {
          new_tab_id = sessions::SessionTabHelper::IdForTab(
                           params.navigated_or_inserted_contents)
                           .id();
        }
      }
    }
  }
  std::move(callback).Run(new_tab_id);
}

void AetherTabManagerHandler::AddObserver(
    mojo::PendingRemote<aether::mojom::TabManagerObserver> observer) {
  observers_.Add(std::move(observer));
}

void AetherTabManagerHandler::OnTabStripModelChanged(
    TabStripModel* tab_strip_model,
    const TabStripModelChange& change,
    const TabStripSelectionChange& selection) {
  NotifyTabsChanged();
}

aether::mojom::AetherTabPtr AetherTabManagerHandler::TabAtIndex(int index) {
  content::WebContents* wc = tab_strip_model_->GetWebContentsAt(index);
  if (!wc)
    return nullptr;

  auto tab = aether::mojom::AetherTab::New();
  tab->id = sessions::SessionTabHelper::IdForTab(wc).id();
  tab->title = base::UTF16ToUTF8(wc->GetTitle());
  tab->url = wc->GetLastCommittedURL().spec();
  tab->favicon_url = "";  // populated in Batch 13 with favicon driver
  tab->is_active = (wc == tab_strip_model_->GetActiveWebContents());
  tab->is_pinned = tab_strip_model_->IsTabPinned(index);
  tab->is_sleeping = false;  // Batch 14
  tab->is_loading = wc->IsLoading();
  tab->group_id = -1;        // Batch 14 full tab groups
  return tab;
}

std::vector<aether::mojom::AetherTabPtr> AetherTabManagerHandler::BuildTabList() {
  std::vector<aether::mojom::AetherTabPtr> tabs;
  for (int i = 0; i < tab_strip_model_->count(); ++i) {
    if (auto tab = TabAtIndex(i)) {
      tabs.push_back(std::move(tab));
    }
  }
  return tabs;
}

int AetherTabManagerHandler::FindTabIndexById(int32_t tab_id) {
  for (int i = 0; i < tab_strip_model_->count(); ++i) {
    content::WebContents* wc = tab_strip_model_->GetWebContentsAt(i);
    if (wc && sessions::SessionTabHelper::IdForTab(wc).id() == tab_id) {
      return i;
    }
  }
  return TabStripModel::kNoTab;
}

void AetherTabManagerHandler::NotifyTabsChanged() {
  for (auto& observer : observers_) {
    observer->OnTabsChanged(BuildTabList());
  }
}
