export type NenType =
  | "Enhancer"
  | "Emitter"
  | "Transmuter"
  | "Conjurer"
  | "Manipulator"
  | "Specialist";

export interface BaseStats {
  strength: number;
  speed: number;
  durability: number;
  intelligence: number;
  auraCapacity: number;
  auraControl: number;
  experience: number;
}

export interface Fighter {
  id: number;
  name: string;
  nenType: NenType;
  baseStats: BaseStats;
}

export interface StatBreakdown {
  stat: string;
  value: number;
  weight: number;
  contribution: number;
}

export interface FighterScore {
  weighted: number;
  final: number;
  multiplier: number;
}

export interface PredictionResponse {
  winner: "fighterA" | "fighterB" | "draw";
  verdictText: string;
  scores: {
    A: FighterScore;
    B: FighterScore;
  };
  breakdown: {
    A: StatBreakdown[];
    B: StatBreakdown[];
  };
  nenExplanation: {
    AtoB: string;
    BtoA: string;
  };
  decisionExplanation: string;
}

export interface PredictionRequest {
  fighterA: Fighter;
  fighterB: Fighter;
}

