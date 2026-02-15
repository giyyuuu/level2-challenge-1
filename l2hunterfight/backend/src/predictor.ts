import { Fighter, PredictionResponse } from "./types";
import {
  calculateFighterScores,
  getNenExplanation,
} from "./scoring";

const SCORE_DIFFERENCE_THRESHOLD = 3.0;

export function predictFight(
  fighterA: Fighter,
  fighterB: Fighter
): PredictionResponse {
  const {
    scoreA,
    scoreB,
    breakdownA,
    breakdownB,
  } = calculateFighterScores(fighterA, fighterB);

  const scoreDifference = Math.abs(scoreA.final - scoreB.final);

  let winner: "fighterA" | "fighterB" | "draw";
  let verdictText: string;
  let decisionExplanation: string;

  if (scoreDifference >= SCORE_DIFFERENCE_THRESHOLD) {
    if (scoreA.final > scoreB.final) {
      winner = "fighterA";
      verdictText = `${fighterA.name} wins!`;
      decisionExplanation = `${fighterA.name} wins with a final score of ${scoreA.final} vs ${fighterB.name}'s ${scoreB.final} (difference: ${scoreDifference.toFixed(2)} points, which is >= ${SCORE_DIFFERENCE_THRESHOLD} threshold)`;
    } else {
      winner = "fighterB";
      verdictText = `${fighterB.name} wins!`;
      decisionExplanation = `${fighterB.name} wins with a final score of ${scoreB.final} vs ${fighterA.name}'s ${scoreA.final} (difference: ${scoreDifference.toFixed(2)} points, which is >= ${SCORE_DIFFERENCE_THRESHOLD} threshold)`;
    }
  } else {
    winner = "draw";
    verdictText = "Too close to call!";
    decisionExplanation = `The fight is too close to call. ${fighterA.name} has a final score of ${scoreA.final} and ${fighterB.name} has ${scoreB.final} (difference: ${scoreDifference.toFixed(2)} points, which is < ${SCORE_DIFFERENCE_THRESHOLD} threshold). The outcome would depend on strategy, environment, and other unpredictable factors.`;
  }

  return {
    winner,
    verdictText,
    scores: {
      A: scoreA,
      B: scoreB,
    },
    breakdown: {
      A: breakdownA,
      B: breakdownB,
    },
    nenExplanation: {
      AtoB: getNenExplanation(fighterA.nenType, fighterB.nenType),
      BtoA: getNenExplanation(fighterB.nenType, fighterA.nenType),
    },
    decisionExplanation,
  };
}

