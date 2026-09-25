import "dotenv/config";
import express from "express";
import cors from "cors";

import searchPgsRouter from "./routes/searchPgs.js";
import investigatePgRouter from "./routes/investigatePg.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", searchPgsRouter);
app.use("/api", investigatePgRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SafeStay backend running on port ${PORT}`);
});
