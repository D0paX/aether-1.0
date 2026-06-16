import { AutocompleteSuggestion } from "../../shared/types/navigation";

const FAKE_URLS = [
  "github.com",
  "google.com",
  "youtube.com",
  "wikipedia.org",
  "twitter.com",
  "facebook.com",
  "amazon.com",
  "reddit.com",
  "netflix.com",
  "linkedin.com"
];

export function getMockSuggestions(input: string): AutocompleteSuggestion[] {
  if (!input) return [];

  const searchSuggestion: AutocompleteSuggestion = {
    id: "search-0",
    type: "search",
    title: input,
    description: `Search Google for "${input}"`,
    url: `https://www.google.com/search?q=${encodeURIComponent(input)}`
  };

  const urlSuggestions: AutocompleteSuggestion[] = FAKE_URLS
    .filter(url => url.startsWith(input.toLowerCase()))
    .slice(0, 5)
    .map((url, i): AutocompleteSuggestion => ({
      id: `url-${i}`,
      type: "url",
      title: url,
      url: `https://${url}`
    }));

  return [searchSuggestion, ...urlSuggestions];
}
