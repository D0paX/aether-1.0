export type SecurityLevel = "secure" | "warning" | "dangerous" | "none";

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

export type NavigationStateCallback = (state: NavigationState) => void;
export type LoadProgressCallback = (progress: number) => void;

export type SuggestionType = "url" | "search" | "history" | "bookmark";

export interface AutocompleteSuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  url: string;
  description?: string;
  isBold?: boolean;
}
