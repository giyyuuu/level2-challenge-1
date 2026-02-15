import { useState } from "react";
import { PredictionResponse, Fighter } from "../types";
import "./ResultsPanel.css";

interface ResultsPanelProps {
  prediction: PredictionResponse;
  fighterA: Fighter;
  fighterB: Fighter;
}

export default function ResultsPanel({
  prediction,
  fighterA,
  fighterB,
}: ResultsPanelProps) {
  const [expandedA, setExpandedA] = useState(false);
  const [expandedB, setExpandedB] = useState(false);

  const getWinnerClass = () => {
    if (prediction.winner === "draw") return "draw";
    return prediction.winner === "fighterA" ? "winner-a" : "winner-b";
  };

  return (
    <div className="results-panel">
      <div className={`verdict-banner ${getWinnerClass()}`}>
        <h2>{prediction.verdictText}</h2>
      </div>

      <div className="scores-summary">
        <div className="score-card">
          <h3>{fighterA.name}</h3>
          <div className="score-details">
            <div>
              <span className="score-label">Weighted Score:</span>
              <span className="score-value">
                {prediction.scores.A.weighted}
              </span>
            </div>
            <div>
              <span className="score-label">Nen Multiplier:</span>
              <span className="score-value">
                {prediction.scores.A.multiplier}x
              </span>
            </div>
            <div>
              <span className="score-label">Final Score:</span>
              <span className="score-value final">{prediction.scores.A.final}</span>
            </div>
          </div>
        </div>

        <div className="vs-divider">VS</div>

        <div className="score-card">
          <h3>{fighterB.name}</h3>
          <div className="score-details">
            <div>
              <span className="score-label">Weighted Score:</span>
              <span className="score-value">
                {prediction.scores.B.weighted}
              </span>
            </div>
            <div>
              <span className="score-label">Nen Multiplier:</span>
              <span className="score-value">
                {prediction.scores.B.multiplier}x
              </span>
            </div>
            <div>
              <span className="score-label">Final Score:</span>
              <span className="score-value final">{prediction.scores.B.final}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="nen-explanation">
        <h3>Nen Type Advantages</h3>
        <div className="nen-details">
          <p>
            <strong>{fighterA.name} vs {fighterB.name}:</strong>{" "}
            {prediction.nenExplanation.AtoB}
          </p>
          <p>
            <strong>{fighterB.name} vs {fighterA.name}:</strong>{" "}
            {prediction.nenExplanation.BtoA}
          </p>
        </div>
      </div>

      <div className="decision-explanation">
        <h3>Decision Explanation</h3>
        <p>{prediction.decisionExplanation}</p>
      </div>

      <div className="breakdown-section">
        <div className="breakdown-card">
          <button
            className="breakdown-toggle"
            onClick={() => setExpandedA(!expandedA)}
          >
            {expandedA ? "▼" : "▶"} Show Full Math - {fighterA.name}
          </button>
          {expandedA && (
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>Value</th>
                  <th>Weight</th>
                  <th>Contribution</th>
                </tr>
              </thead>
              <tbody>
                {prediction.breakdown.A.map((item) => (
                  <tr key={item.stat}>
                    <td>{item.stat}</td>
                    <td>{item.value}</td>
                    <td>{item.weight}</td>
                    <td>{item.contribution.toFixed(4)}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan={3}><strong>Weighted Score Total:</strong></td>
                  <td><strong>{prediction.scores.A.weighted}</strong></td>
                </tr>
                <tr className="multiplier-row">
                  <td colSpan={3}><strong>Nen Multiplier:</strong></td>
                  <td><strong>{prediction.scores.A.multiplier}x</strong></td>
                </tr>
                <tr className="final-row">
                  <td colSpan={3}><strong>Final Score:</strong></td>
                  <td><strong>{prediction.scores.A.final}</strong></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="breakdown-card">
          <button
            className="breakdown-toggle"
            onClick={() => setExpandedB(!expandedB)}
          >
            {expandedB ? "▼" : "▶"} Show Full Math - {fighterB.name}
          </button>
          {expandedB && (
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>Value</th>
                  <th>Weight</th>
                  <th>Contribution</th>
                </tr>
              </thead>
              <tbody>
                {prediction.breakdown.B.map((item) => (
                  <tr key={item.stat}>
                    <td>{item.stat}</td>
                    <td>{item.value}</td>
                    <td>{item.weight}</td>
                    <td>{item.contribution.toFixed(4)}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan={3}><strong>Weighted Score Total:</strong></td>
                  <td><strong>{prediction.scores.B.weighted}</strong></td>
                </tr>
                <tr className="multiplier-row">
                  <td colSpan={3}><strong>Nen Multiplier:</strong></td>
                  <td><strong>{prediction.scores.B.multiplier}x</strong></td>
                </tr>
                <tr className="final-row">
                  <td colSpan={3}><strong>Final Score:</strong></td>
                  <td><strong>{prediction.scores.B.final}</strong></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

