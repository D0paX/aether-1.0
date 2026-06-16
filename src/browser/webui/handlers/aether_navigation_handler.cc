#include "aether/src/browser/webui/handlers/aether_navigation_handler.h"

#include "base/strings/escape.h"
#include "base/strings/utf_string_conversions.h"
#include "chrome/browser/search_engines/template_url_service_factory.h"
#include "chrome/browser/ui/browser_navigator.h"
#include "chrome/browser/ui/browser_navigator_params.h"
#include "chrome/browser/ui/tabs/tab_strip_model.h"
#include "components/search_engines/template_url_service.h"
#include "components/security_state/content/security_state_tab_helper.h"
#include "components/security_state/core/security_state.h"
#include "content/public/browser/navigation_controller.h"
#include "content/public/browser/navigation_handle.h"
#include "content/public/browser/page.h"
#include "content/public/browser/web_contents.h"
#include "ui/base/page_transition_types.h"
#include "ui/base/window_open_disposition.h"
#include "url/gurl.h"

AetherNavigationHandler::AetherNavigationHandler(Browser* browser)
    : browser_(browser) {
  ObserveActiveTab();
  browser_->tab_strip_model()->AddObserver(this);
}

AetherNavigationHandler::~AetherNavigationHandler() {
  browser_->tab_strip_model()->RemoveObserver(this);
}

void AetherNavigationHandler::BindReceiver(
    mojo::PendingReceiver<aether::mojom::NavigationHandler> receiver) {
  receiver_.reset();
  receiver_.Bind(std::move(receiver));
}

void AetherNavigationHandler::Navigate(const std::string& input) {
  GURL destination_url(input);
  if (!destination_url.is_valid()) {
    TemplateURLService* template_url_service =
        TemplateURLServiceFactory::GetForProfile(browser_->profile());
    if (template_url_service &&
        template_url_service->GetDefaultSearchProvider()) {
      const TemplateURL* default_provider =
          template_url_service->GetDefaultSearchProvider();
      const TemplateURLRef& search_url_ref = default_provider->url_ref();
      TemplateURLRef::SearchTermsArgs search_args(base::UTF8ToUTF16(input));
      std::string search_url = search_url_ref.ReplaceSearchTerms(
          search_args, template_url_service->search_terms_data());
      destination_url = GURL(search_url);
    } else {
      destination_url = GURL("https://www.google.com/search?q=" +
                             base::EscapeQueryParamValue(input, true));
    }
  }

  NavigateParams params(browser_, destination_url, ui::PAGE_TRANSITION_TYPED);
  params.disposition = WindowOpenDisposition::CURRENT_TAB;
  ::Navigate(&params);
}

void AetherNavigationHandler::GoBack() {
  content::WebContents* wc = browser_->tab_strip_model()->GetActiveWebContents();
  if (wc && wc->GetController().CanGoBack()) {
    wc->GetController().GoBack();
  }
}

void AetherNavigationHandler::GoForward() {
  content::WebContents* wc = browser_->tab_strip_model()->GetActiveWebContents();
  if (wc && wc->GetController().CanGoForward()) {
    wc->GetController().GoForward();
  }
}

void AetherNavigationHandler::Reload() {
  content::WebContents* wc = browser_->tab_strip_model()->GetActiveWebContents();
  if (wc) {
    wc->GetController().Reload(content::ReloadType::NORMAL, false);
  }
}

void AetherNavigationHandler::Stop() {
  content::WebContents* wc = browser_->tab_strip_model()->GetActiveWebContents();
  if (wc) {
    wc->Stop();
  }
}

void AetherNavigationHandler::GetNavigationState(
    GetNavigationStateCallback callback) {
  std::move(callback).Run(BuildNavigationState());
}

void AetherNavigationHandler::AddObserver(
    mojo::PendingRemote<aether::mojom::NavigationObserver> observer) {
  observers_.Add(std::move(observer));
}

void AetherNavigationHandler::DidStartNavigation(
    content::NavigationHandle* navigation_handle) {
  if (navigation_handle->IsInPrimaryMainFrame()) {
    NotifyObservers();
  }
}

void AetherNavigationHandler::PrimaryPageChanged(content::Page& page) {
  NotifyObservers();
}

void AetherNavigationHandler::LoadProgressChanged(double progress) {
  for (auto& observer : observers_) {
    observer->OnLoadProgressChanged(progress);
  }
}

void AetherNavigationHandler::OnTabStripModelChanged(
    TabStripModel* tab_strip_model,
    const TabStripModelChange& change,
    const TabStripSelectionChange& selection) {
  if (selection.active_tab_changed()) {
    ObserveActiveTab();
    NotifyObservers();
  }
}

aether::mojom::NavigationStatePtr
AetherNavigationHandler::BuildNavigationState() {
  content::WebContents* wc = browser_->tab_strip_model()->GetActiveWebContents();
  if (!wc) {
    return aether::mojom::NavigationState::New();
  }

  auto state = aether::mojom::NavigationState::New();
  state->url = wc->GetLastCommittedURL().spec();
  state->display_url = wc->GetLastCommittedURL().host();
  state->title = base::UTF16ToUTF8(wc->GetTitle());
  state->security_level = GetSecurityLevel();
  state->can_go_back = wc->GetController().CanGoBack();
  state->can_go_forward = wc->GetController().CanGoForward();
  state->is_loading = wc->IsLoading();
  state->load_progress = wc->GetLoadProgress();
  return state;
}

aether::mojom::SecurityLevel AetherNavigationHandler::GetSecurityLevel() {
  content::WebContents* wc = browser_->tab_strip_model()->GetActiveWebContents();
  if (!wc) {
    return aether::mojom::SecurityLevel::kNone;
  }

  auto* helper = security_state::SecurityStateTabHelper::FromWebContents(wc);
  if (!helper) {
    return aether::mojom::SecurityLevel::kNone;
  }

  security_state::SecurityLevel level = helper->GetSecurityLevel();
  switch (level) {
    case security_state::NONE:
      return aether::mojom::SecurityLevel::kNone;
    case security_state::WARNING:
      return aether::mojom::SecurityLevel::kWarning;
    case security_state::DANGEROUS:
      return aether::mojom::SecurityLevel::kDangerous;
    case security_state::SECURE:
      return aether::mojom::SecurityLevel::kSecure;
    case security_state::SECURE_WITH_POLICY_INSTALLED_CERT:
      return aether::mojom::SecurityLevel::kSecureWithPolicyInstalledCert;
    default:
      return aether::mojom::SecurityLevel::kNone;
  }
}

void AetherNavigationHandler::NotifyObservers() {
  if (observers_.empty()) {
    return;
  }
  auto state = BuildNavigationState();
  for (auto& observer : observers_) {
    observer->OnNavigationStateChanged(state.Clone());
  }
}

void AetherNavigationHandler::ObserveActiveTab() {
  content::WebContents* wc = browser_->tab_strip_model()->GetActiveWebContents();
  Observe(wc);
}
