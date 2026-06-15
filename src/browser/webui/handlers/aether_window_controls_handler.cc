// Aether Browser — Window Controls Handler
// Implements aether::mojom::WindowControls (see
// src/browser/webui/mojom/window_controls.mojom). Bridges the Aether chrome
// WebUI to native window management via views::Widget.

#include "aether/src/browser/webui/handlers/aether_window_controls_handler.h"

#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_commands.h"
#include "chrome/browser/ui/browser_window.h"
#include "chrome/browser/ui/views/frame/browser_view.h"
#include "ui/gfx/geometry/rect.h"
#include "ui/views/widget/widget.h"

AetherWindowControlsHandler::AetherWindowControlsHandler(
    mojo::PendingReceiver<aether::mojom::WindowControls> receiver,
    Browser* browser)
    : receiver_(this, std::move(receiver)),
      browser_(browser) {
  DCHECK(browser_);
  views::Widget* widget = GetWidget();
  if (widget) {
    widget_ = widget;
    widget_->AddObserver(this);
    last_maximized_state_ = widget_->IsMaximized();
  }
}

AetherWindowControlsHandler::~AetherWindowControlsHandler() {
  if (widget_) {
    widget_->RemoveObserver(this);
  }
}

void AetherWindowControlsHandler::Minimize() {
  views::Widget* widget = GetWidget();
  if (widget) {
    widget->Minimize();
  }
}

void AetherWindowControlsHandler::Maximize() {
  views::Widget* widget = GetWidget();
  if (widget) {
    widget->Maximize();
  }
}

void AetherWindowControlsHandler::Restore() {
  views::Widget* widget = GetWidget();
  if (widget) {
    widget->Restore();
  }
}

void AetherWindowControlsHandler::Close() {
  // Respect Normal Browser close path (respects unload handlers, unsaved changes, etc.)
  chrome::CloseWindow(browser_);
}

void AetherWindowControlsHandler::IsMaximized(IsMaximizedCallback callback) {
  views::Widget* widget = GetWidget();
  std::move(callback).Run(widget ? widget->IsMaximized() : false);
}

void AetherWindowControlsHandler::AddObserver(
    mojo::PendingRemote<aether::mojom::WindowControlsObserver> observer) {
  observers_.Add(std::move(observer));
}

void AetherWindowControlsHandler::OnWidgetBoundsChanged(
    views::Widget* widget,
    const gfx::Rect& new_bounds) {
  DCHECK_EQ(widget, widget_);
  bool is_maximized = widget->IsMaximized();
  if (is_maximized != last_maximized_state_) {
    last_maximized_state_ = is_maximized;
    for (auto& observer : observers_) {
      observer->OnMaximizedStateChanged(is_maximized);
    }
  }
}

void AetherWindowControlsHandler::OnWidgetDestroying(views::Widget* widget) {
  DCHECK_EQ(widget, widget_);
  widget_->RemoveObserver(this);
  widget_ = nullptr;
}

views::Widget* AetherWindowControlsHandler::GetWidget() const {
  if (!browser_ || !browser_->window()) {
    return nullptr;
  }
  BrowserView* browser_view = BrowserView::GetBrowserViewForBrowser(browser_);
  return browser_view ? browser_view->GetWidget() : nullptr;
}
