const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export async function searchPGs({ city, area, budget, gender }) {
  const response = await fetch(`${API_BASE_URL}/search-pgs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      city,
      area,
      budget: budget ? Number(budget) : "",
      preferences: { gender },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to search PGs");
  }

  return data;
}

export async function investigatePG(listing) {
  const response = await fetch(`${API_BASE_URL}/investigate-pg`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listing }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to investigate PG");
  }

  return data;
}
