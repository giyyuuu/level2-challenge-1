import { Fighter, NenType } from "./types";

const NEN_TYPES: NenType[] = [
  "Enhancer",
  "Emitter",
  "Transmuter",
  "Conjurer",
  "Manipulator",
  "Specialist",
];

const STAT_NAMES = [
  "strength",
  "speed",
  "durability",
  "intelligence",
  "auraCapacity",
  "auraControl",
  "experience",
] as const;

export function validateFighter(fighter: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!fighter || typeof fighter !== "object") {
    return { valid: false, errors: ["Fighter must be an object"] };
  }

  // Validate id
  if (typeof fighter.id !== "number" || !Number.isInteger(fighter.id)) {
    errors.push("id must be an integer");
  }

  // Validate name
  if (typeof fighter.name !== "string" || fighter.name.trim().length === 0) {
    errors.push("name must be a non-empty string");
  }

  // Validate nenType
  if (!NEN_TYPES.includes(fighter.nenType)) {
    errors.push(
      `nenType must be one of: ${NEN_TYPES.join(", ")}`
    );
  }

  // Validate baseStats
  if (!fighter.baseStats || typeof fighter.baseStats !== "object") {
    errors.push("baseStats must be an object");
  } else {
    for (const statName of STAT_NAMES) {
      const value = fighter.baseStats[statName];
      if (typeof value !== "number") {
        errors.push(`${statName} must be a number`);
      } else if (value < 0 || value > 100) {
        errors.push(`${statName} must be between 0 and 100 (got ${value})`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

