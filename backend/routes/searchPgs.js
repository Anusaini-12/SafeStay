import { Router } from "express";
import { findListings } from "../services/findListings.js";

const router = Router();

router.post("/search-pgs", async (req, res) => {
  const { city, area, budget, preferences } = req.body || {};

  if (!city || !area) {
    return res.status(400).json({ error: "city and area are required" });
  }

  try {
    const { listings, cityMismatch } = await findListings(city, area, {
      ...(preferences || {}),
      budget,
    });

    res.json({ listings, cityMismatch });
  } catch (error) {
    console.error("POST /api/search-pgs failed:", error.message);
    res.status(500).json({ error: "Failed to search PGs" });
  }
});

export default router;