// Aether Browser — Window Controls Handler
// Implements aether::mojom::WindowControls (see
// src/browser/webui/mojom/window_controls.mojom). Bridges the Aether chrome
// WebUI to native window management via views::Widget.

#ifndef BROWSER_WEBUI_HANDLERS_AETHER_WINDOW_CONTROLS_HANDLER_H_
#define BROWSER_WEBUI_HANDLERS_AETHER_WINDOW_CONTROLS_HANDLER_H_

#include "aether/src/browser/webui/mojom/window_controls.mojom.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"
#include "mojo/public/cpp/bindings/pending_remote.h"
#include "mojo/public/cpp/bindings/receiver.h"
#include "mojo/public/cpp/bindings/remote_set.h"
#include "ui/views/widget/widget_observer.h"

class Browser;

namespace views {
class Widget;
}

class AetherWindowControlsHandler : public aether::mojom::WindowControls,
                                    public views::WidgetObserver {
 public:
  AetherWindowControlsHandler(
      mojo::PendingReceiver<aether::mojom::WindowControls> receiver,
      Browser* browser);
  ~AetherWindowControlsHandler() override;

  AetherWindowControlsHandler(const AetherWindowControlsHandler&) = delete;
  AetherWindowControlsHandler& operator=(const AetherWindowControlsHandler&) = delete;

  // aether::mojom::WindowControls:
  void Minimize() override;
  void Maximize() override;
  void Restore() override;
  void Close() override;
  void IsMaximized(IsMaximizedCallback callback) override;
  void AddObserver(
      mojo::PendingRemote<aether::mojom::WindowControlsObserver> observer) override;

  // views::WidgetObserver:
  void OnWidgetBoundsChanged(views::Widget* widget,
                             const gfx::Rect& new_bounds) override;
  void OnWidgetDestroying(views::Widget* widget) override;

 private:
  views::Widget* GetWidget() const;

  mojo::Receiver<aether::mojom::WindowControls> receiver_;
  Browser* const browser_;
  views::Widget* widget_ = nullptr;

  // Keep track of the last known maximized state.
  bool last_maximized_state_ = false;

  // List of registered observers on the WebUI side.
  mojo::RemoteSet<aether::mojom::WindowControlsObserver> observers_;
};

#endif  // BROWSER_WEBUI_HANDLERS_AETHER_WINDOW_CONTROLS_HANDLER_H_
