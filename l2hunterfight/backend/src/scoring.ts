import { Fighter, StatBreakdown, FighterScore, NenType } from "./types";

// Stat weights
const WEIGHTS = {
  strength: 0.18,
  speed: 0.16,
  durability: 0.16,
  intelligence: 0.10,
  auraCapacity: 0.15,
  auraControl: 0.15,
  experience: 0.10,
} as const;

// Nen type advantage chart (attacker -> defender)
const NEN_ADVANTAGES: Record<NenType, Partial<Record<NenType, number>>> = {
  Enhancer: { Transmuter: 1.06 },
  Transmuter: { Conjurer: 1.06 },
  Conjurer: { Manipulator: 1.06 },
  Manipulator: { Emitter: 1.06 },
  Emitter: { Enhancer: 1.06 },
  Specialist: {}, // No advantages or disadvantages
};

export function calculateWeightedScore(
  fighter: Fighter
): { score: number; breakdown: StatBreakdown[] } {
  const breakdown: StatBreakdown[] = [];
  let totalScore = 0;

  for (const [statName, weight] of Object.entries(WEIGHTS)) {
    const value = fighter.baseStats[statName as keyof typeof WEIGHTS];
    const contribution = value * weight;
    totalScore += contribution;

    breakdown.push({
      stat: statName,
      value,
      weight,
      contribution: Number(contribution.toFixed(4)),
    });
  }

  return {
    score: Number(totalScore.toFixed(4)),
    breakdown,
  };
}

export function getNenMultiplier(
  attackerType: NenType,
  defenderType: NenType
): number {
  const advantage = NEN_ADVANTAGES[attackerType]?.[defenderType];
  return advantage ?? 1.0;
}

export function calculateFinalScore(
  weightedScore: number,
  attackerType: NenType,
  defenderType: NenType
): { finalScore: number; multiplier: number } {
  const multiplier = getNenMultiplier(attackerType, defenderType);
  const finalScore = weightedScore * multiplier;
  return {
    finalScore: Number(finalScore.toFixed(4)),
    multiplier: Number(multiplier.toFixed(4)),
  };
}

export function getNenExplanation(
  attackerType: NenType,
  defenderType: NenType
): string {
  const multiplier = getNenMultiplier(attackerType, defenderType);
  if (multiplier > 1.0) {
    return `${attackerType} has an advantage over ${defenderType} (${multiplier}x multiplier)`;
  } else if (multiplier < 1.0) {
    return `${attackerType} has a disadvantage against ${defenderType} (${multiplier}x multiplier)`;
  } else {
    if (attackerType === "Specialist") {
      return `${attackerType} has no advantage or disadvantage against ${defenderType} (1.0x multiplier)`;
    }
    return `No advantage relationship between ${attackerType} and ${defenderType} (1.0x multiplier)`;
  }
}

export function calculateFighterScores(
  fighterA: Fighter,
  fighterB: Fighter
): {
  scoreA: FighterScore;
  scoreB: FighterScore;
  breakdownA: StatBreakdown[];
  breakdownB: StatBreakdown[];
} {
  // Calculate weighted scores
  const { score: weightedA, breakdown: breakdownA } =
    calculateWeightedScore(fighterA);
  const { score: weightedB, breakdown: breakdownB } =
    calculateWeightedScore(fighterB);

  // Calculate final scores with Nen multipliers
  const { finalScore: finalA, multiplier: multiplierA } = calculateFinalScore(
    weightedA,
    fighterA.nenType,
    fighterB.nenType
  );
  const { finalScore: finalB, multiplier: multiplierB } = calculateFinalScore(
    weightedB,
    fighterB.nenType,
    fighterA.nenType
  );

  return {
    scoreA: {
      weighted: weightedA,
      final: finalA,
      multiplier: multiplierA,
    },
    scoreB: {
      weighted: weightedB,
      final: finalB,
      multiplier: multiplierB,
    },
    breakdownA,
    breakdownB,
  };
}

