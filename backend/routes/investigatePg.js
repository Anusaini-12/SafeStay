import { Router } from "express";
import { investigateListing } from "../services/investigateListing.js";
import { investigationRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post(
  "/investigate-pg",
  investigationRateLimiter,
  async (req, res) => {
    const { listing } = req.body || {};

    if (
      !listing ||
      typeof listing !== "object" ||
      Array.isArray(listing)
    ) {
      return res.status(400).json({
        error: "listing must be an object",
      });
    }

    if (
      typeof listing.name !== "string" ||
      !listing.name.trim()
    ) {
      return res.status(400).json({
        error: "listing.name is required and must be a non-empty string",
      });
    }

    try {
      const result = await investigateListing({
        ...listing,
        name: listing.name.trim(),
      });

      return res.json(result);
    } catch (error) {
      console.error("POST /api/investigate-pg failed:", error);

      return res.status(500).json({
        error: "Failed to investigate this listing",
      });
    }
  }
);

export default router;