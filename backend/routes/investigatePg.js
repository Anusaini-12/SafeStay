import { Router } from "express";
import { investigateListing } from "../services/investigateListing.js";

const router = Router();

router.post("/investigate-pg", async (req, res) => {
  const { listing } = req.body || {};

  if (!listing || !listing.name) {
    return res.status(400).json({ error: "listing is required" });
  }

  try {
    const result = await investigateListing(listing);
    res.json(result);
  } catch (error) {
    console.error("POST /api/investigate-pg failed:", error.message);
    res.status(500).json({ error: "Failed to investigate this listing" });
  }
});

export default router;
