const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function parseResponse(response, fallbackMessage) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    if (!response.ok) {
      throw new Error(fallbackMessage);
    }

    return {};
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || fallbackMessage);
  }

  return data;
}

export async function searchPGs({ city, area, budget, gender }) {
  const response = await fetch(`${API_BASE_URL}/search-pgs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      city,
      area,
      budget: budget ? Number(budget) : "",
      preferences: { gender },
    }),
  });

  return parseResponse(response, "Failed to search PGs");
}

export async function investigatePG(listing) {
  const response = await fetch(`${API_BASE_URL}/investigate-pg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listing }),
  });

  return parseResponse(response, "Failed to investigate PG");
}