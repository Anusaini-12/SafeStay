const SEARCH_COUNT_KEY = "safestay_search_count";
const FREE_SEARCH_LIMIT = 2;

export function getSearchCount() {
  const storedCount = localStorage.getItem(SEARCH_COUNT_KEY);
  return storedCount ? Number(storedCount) : 0;
}

export function canSearch() {
  return getSearchCount() < FREE_SEARCH_LIMIT;
}

export function incrementSearchCount() {
  const currentCount = getSearchCount();
  const newCount = currentCount + 1;
  localStorage.setItem(SEARCH_COUNT_KEY, String(newCount));
  return newCount;
}

export function getRemainingSearches() {
  return Math.max(FREE_SEARCH_LIMIT - getSearchCount(), 0);
}

export { FREE_SEARCH_LIMIT };
