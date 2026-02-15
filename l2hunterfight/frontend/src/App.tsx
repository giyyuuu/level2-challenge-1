import { useState } from "react";
import FighterPanel from "./components/FighterPanel";
import ResultsPanel from "./components/ResultsPanel";
import { Fighter, PredictionResponse } from "./types";
import "./App.css";

const NEN_TYPES: Fighter["nenType"][] = [
  "Enhancer",
  "Emitter",
  "Transmuter",
  "Conjurer",
  "Manipulator",
  "Specialist",
];

const EXAMPLE_FIGHTER_A: Fighter = {
  id: 1,
  name: "Gon Freecss",
  nenType: "Enhancer",
  baseStats: {
    strength: 85,
    speed: 80,
    durability: 75,
    intelligence: 70,
    auraCapacity: 90,
    auraControl: 75,
    experience: 60,
  },
};

const EXAMPLE_FIGHTER_B: Fighter = {
  id: 2,
  name: "Killua Zoldyck",
  nenType: "Transmuter",
  baseStats: {
    strength: 70,
    speed: 95,
    durability: 70,
    intelligence: 85,
    auraCapacity: 80,
    auraControl: 90,
    experience: 75,
  },
};

const INITIAL_FIGHTER_A: Fighter = {
  id: 1,
  name: "",
  nenType: "Enhancer",
  baseStats: {
    strength: 50,
    speed: 50,
    durability: 50,
    intelligence: 50,
    auraCapacity: 50,
    auraControl: 50,
    experience: 50,
  },
};

const INITIAL_FIGHTER_B: Fighter = {
  id: 2,
  name: "",
  nenType: "Emitter",
  baseStats: {
    strength: 50,
    speed: 50,
    durability: 50,
    intelligence: 50,
    auraCapacity: 50,
    auraControl: 50,
    experience: 50,
  },
};

function App() {
  const [fighterA, setFighterA] = useState<Fighter>(INITIAL_FIGHTER_A);
  const [fighterB, setFighterB] = useState<Fighter>(INITIAL_FIGHTER_B);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      console.log("[Frontend] Sending request to /api/predict", { fighterA, fighterB });
      
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fighterA, fighterB }),
      });

      console.log("[Frontend] Response status:", response.status, response.statusText);
      console.log("[Frontend] Response Content-Type:", response.headers.get("Content-Type"));

      // Get response text first to safely check if it's JSON
      const responseText = await response.text();
      console.log("[Frontend] Response body (first 200 chars):", responseText.substring(0, 200));

      if (!response.ok) {
        // Try to parse as JSON, but handle non-JSON responses gracefully
        let errorMessage = `Request failed with status ${response.status}`;
        
        if (responseText.trim()) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorData.message || errorMessage;
            if (errorData.details) {
              errorMessage += `: ${Array.isArray(errorData.details) ? errorData.details.join(", ") : errorData.details}`;
            }
          } catch (parseError) {
            // Response is not JSON (might be HTML error page or plain text)
            console.error("[Frontend] Failed to parse error response as JSON:", parseError);
            errorMessage = `Server error (${response.status}): ${responseText.substring(0, 100)}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Parse successful response
      if (!responseText.trim()) {
        throw new Error("Server returned empty response");
      }

      let data: PredictionResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("[Frontend] Failed to parse success response as JSON:", parseError);
        console.error("[Frontend] Response text:", responseText);
        throw new Error("Server returned invalid JSON response");
      }

      console.log("[Frontend] Successfully parsed prediction:", data);
      setPrediction(data);
    } catch (err) {
      console.error("[Frontend] Error in handlePredict:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSwapFighters = () => {
    const temp = fighterA;
    setFighterA(fighterB);
    setFighterB(temp);
    setPrediction(null);
  };

  const handleLoadExamples = () => {
    setFighterA(EXAMPLE_FIGHTER_A);
    setFighterB(EXAMPLE_FIGHTER_B);
    setPrediction(null);
  };

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.fighterA && parsed.fighterB) {
        setFighterA(parsed.fighterA);
        setFighterB(parsed.fighterB);
        setJsonMode(false);
        setJsonInput("");
        setPrediction(null);
      } else {
        setError("JSON must contain fighterA and fighterB");
      }
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Hunter Fight Predictor</h1>
        <p className="subtitle">
          Simulate duels between Hunters using a transparent, rule-based combat
          scoring system
        </p>
      </header>

      <div className="controls-bar">
        <button onClick={handleLoadExamples} className="btn btn-secondary">
          Load Example Fighters
        </button>
        <button onClick={handleSwapFighters} className="btn btn-secondary">
          Swap Fighters
        </button>
        <button
          onClick={() => {
            setJsonMode(!jsonMode);
            setJsonInput("");
            setError(null);
          }}
          className="btn btn-secondary"
        >
          {jsonMode ? "Form Mode" : "JSON Mode"}
        </button>
      </div>

      {jsonMode ? (
        <div className="json-input-container">
          <textarea
            className="json-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"fighterA": {...}, "fighterB": {...}}'
          />
          <button onClick={handleJsonSubmit} className="btn btn-primary">
            Load from JSON
          </button>
        </div>
      ) : (
        <div className="fighters-container">
          <FighterPanel
            fighter={fighterA}
            onChange={setFighterA}
            label="Fighter A"
          />
          <FighterPanel
            fighter={fighterB}
            onChange={setFighterB}
            label="Fighter B"
          />
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="predict-button-container">
        <button
          onClick={handlePredict}
          disabled={loading || !fighterA.name || !fighterB.name}
          className="btn btn-primary btn-large"
        >
          {loading ? "Predicting..." : "Predict Fight"}
        </button>
      </div>

      {prediction && (
        <ResultsPanel
          prediction={prediction}
          fighterA={fighterA}
          fighterB={fighterB}
        />
      )}
    </div>
  );
}

export default App;

