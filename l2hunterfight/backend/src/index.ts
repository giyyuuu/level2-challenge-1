import express from "express";
import cors from "cors";
import { validateFighter } from "./validation";
import { predictFight } from "./predictor";
import { PredictionRequest } from "./types";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Middleware to ensure all responses are JSON
app.use((req, res, next) => {
  // Store original json method
  const originalJson = res.json.bind(res);
  
  // Override json to always set Content-Type
  res.json = function (body: any) {
    res.setHeader("Content-Type", "application/json");
    return originalJson(body);
  };
  
  next();
});

// Error handler for JSON parsing errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Backend] JSON parsing error:", err);
  
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON in request body",
      message: err.message,
    });
  }
  
  next(err);
});

app.post("/api/predict", (req, res) => {
  try {
    console.log("[Backend] Received POST /api/predict");
    console.log("[Backend] Request body:", JSON.stringify(req.body, null, 2));
    
    // Check if body was parsed (express.json() might have failed)
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error("[Backend] Empty or missing request body");
      return res.status(400).json({
        error: "Request body is required and must be valid JSON",
        message: "Expected JSON object with fighterA and fighterB",
      });
    }

    const { fighterA, fighterB }: PredictionRequest = req.body;

    if (!fighterA || !fighterB) {
      console.error("[Backend] Missing fighterA or fighterB");
      return res.status(400).json({
        error: "Both fighterA and fighterB are required",
        received: {
          hasFighterA: !!fighterA,
          hasFighterB: !!fighterB,
        },
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
      console.error("[Backend] Validation failed:", errors);
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    // Calculate prediction
    console.log("[Backend] Calculating prediction...");
    const prediction = predictFight(fighterA, fighterB);
    console.log("[Backend] Prediction calculated successfully");

    res.json(prediction);
  } catch (error) {
    console.error("[Backend] Error predicting fight:", error);
    console.error("[Backend] Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    // Ensure we always return JSON, even on unexpected errors
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404 handler - must return JSON
app.use((req, res) => {
  console.warn("[Backend] 404 - Route not found:", req.method, req.path);
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// Global error handler - catch any unhandled errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Backend] Unhandled error:", err);
  
  // Ensure JSON response even for unhandled errors
  res.status(500).json({
    error: "Internal server error",
    message: err instanceof Error ? err.message : "Unknown error",
  });
});

app.listen(PORT, () => {
  console.log(`[Backend] Server running on http://localhost:${PORT}`);
  console.log(`[Backend] Health check: http://localhost:${PORT}/api/health`);
});

