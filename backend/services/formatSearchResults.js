export function formatSearchResults(searchResults) {
  return searchResults.map((result) => {
    const data = result.data;

    if (result.type === "google") {
      return {
        type: "google",
        query: result.query,
        results: (data.organic_results || []).slice(0, 5).map((item) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        })),
      };
    }

    if (result.type === "news") {
      return {
        type: "news",
        query: result.query,
        results: (data.news_results || []).slice(0, 5).map((item) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          date: item.date,
        })),
      };
    }

    return {
      type: result.type,
      query: result.query,
      results: [],
    };
  });
}
