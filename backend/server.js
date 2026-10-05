import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import searchPgsRouter from "./routes/searchPgs.js";
import investigatePgRouter from "./routes/investigatePg.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

console.log(
  "Gemini key loaded:",
  !!process.env.GEMINI_API_KEY
);

app.use("/api", searchPgsRouter);
app.use("/api", investigatePgRouter);

app.use(errorHandler);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SafeStay backend running on port ${PORT}`);
});
