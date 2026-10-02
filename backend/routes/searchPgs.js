import { Router } from "express";
import { findListings } from "../services/findListings.js";
import { searchRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post(
  "/search-pgs",
  searchRateLimiter,
  async (req, res) => {
    const { city, area, budget, preferences } = req.body || {};

    if (typeof city !== "string" || !city.trim()) {
      return res.status(400).json({
        error: "city is required and must be a non-empty string",
      });
    }

    if (typeof area !== "string" || !area.trim()) {
      return res.status(400).json({
        error: "area is required and must be a non-empty string",
      });
    }

    if (
      budget !== undefined &&
      budget !== null &&
      (!Number.isFinite(Number(budget)) || Number(budget) <= 0)
    ) {
      return res.status(400).json({
        error: "budget must be a positive number",
      });
    }

    if (
      preferences !== undefined &&
      preferences !== null &&
      (typeof preferences !== "object" || Array.isArray(preferences))
    ) {
      return res.status(400).json({
        error: "preferences must be an object",
      });
    }

    try {
      const { listings, cityMismatch } = await findListings(
        city.trim(),
        area.trim(),
        {
          ...(preferences || {}),
          budget: budget !== undefined ? Number(budget) : undefined,
        }
      );

      return res.json({
        listings,
        cityMismatch,
      });
    } catch (error) {
      console.error("POST /api/search-pgs failed:", error);

      return res.status(500).json({
        error: "Failed to search PGs",
      });
    }
  }
);

export default router;