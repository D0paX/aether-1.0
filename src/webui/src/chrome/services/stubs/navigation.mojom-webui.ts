/* eslint-disable */
// Stub for navigation.mojom-webui.js

export enum SecurityLevel {
  kSecure = 0,
  kWarning = 1,
  kDangerous = 2,
  kNone = 3,
  kSecureWithPolicyInstalledCert = 4
}

export interface NavigationState {
  url: string;
  displayUrl: string;
  title: string;
  securityLevel: SecurityLevel;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  loadProgress: number;
}

export class NavigationObserverCallbackRouter {
  public $ = {
    bindNewPipeAndPassRemote: (): unknown => ({})
  };
  public onNavigationStateChanged = {
    addListener: (_cb: (state: NavigationState) => void): void => {}
  };
  public onLoadProgressChanged = {
    addListener: (_cb: (progress: number) => void): void => {}
  };
}

export class NavigationHandlerRemote {
  public addObserver(_remote: unknown): Promise<void> { return Promise.resolve(); }
  public navigate(_input: string): Promise<void> { return Promise.resolve(); }
  public goBack(): Promise<void> { return Promise.resolve(); }
  public goForward(): Promise<void> { return Promise.resolve(); }
  public reload(): Promise<void> { return Promise.resolve(); }
  public stop(): Promise<void> { return Promise.resolve(); }
  public getNavigationState(): Promise<{ state: NavigationState }> {
    return Promise.resolve({
      state: {
        url: "",
        displayUrl: "",
        title: "",
        securityLevel: SecurityLevel.kNone,
        canGoBack: false,
        canGoForward: false,
        isLoading: false,
        loadProgress: 0
      }
    });
  }
}
