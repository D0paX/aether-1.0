export class WindowControlsRemote {
  public minimize(): Promise<void> {
    return Promise.resolve();
  }
  public maximize(): Promise<void> {
    return Promise.resolve();
  }
  public restore(): Promise<void> {
    return Promise.resolve();
  }
  public close(): Promise<void> {
    return Promise.resolve();
  }
  public isMaximized(): Promise<{ isMaximized: boolean }> {
    return Promise.resolve({ isMaximized: false });
  }
  public addObserver(_observer: any): Promise<void> {
    return Promise.resolve();
  }
  public static getRemote(): WindowControlsRemote {
    return new WindowControlsRemote();
  }
}

export class WindowControlsObserverCallbackRouter {
  public onMaximizedStateChanged = {
    addListener(_callback: (isMaximized: boolean) => void): void {}
  };
  public $ = {
    bindNewPipeAndPassRemote(): any {
      return {};
    }
  };
}
