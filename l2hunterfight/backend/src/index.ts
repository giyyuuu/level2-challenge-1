import express from "express";
import cors from "cors";
import { validateFighter } from "./validation";
import { predictFight } from "./predictor";
import { PredictionRequest } from "./types";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/predict", (req, res) => {
  try {
    const { fighterA, fighterB }: PredictionRequest = req.body;

    if (!fighterA || !fighterB) {
      return res.status(400).json({
        error: "Both fighterA and fighterB are required",
      });
    }

    // Validate both fighters
    const validationA = validateFighter(fighterA);
    const validationB = validateFighter(fighterB);

    if (!validationA.valid || !validationB.valid) {
      const errors = [
        ...validationA.errors.map((e) => `fighterA: ${e}`),
        ...validationB.errors.map((e) => `fighterB: ${e}`),
      ];
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    // Calculate prediction
    const prediction = predictFight(fighterA, fighterB);

    res.json(prediction);
  } catch (error) {
    console.error("Error predicting fight:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

