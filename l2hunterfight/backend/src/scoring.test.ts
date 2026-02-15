import { describe, it, expect } from "vitest";
import {
  calculateWeightedScore,
  getNenMultiplier,
  calculateFinalScore,
  getNenExplanation,
  calculateFighterScores,
} from "./scoring";
import { Fighter } from "./types";

describe("Scoring Logic", () => {
  const mockFighter: Fighter = {
    id: 1,
    name: "Test Fighter",
    nenType: "Enhancer",
    baseStats: {
      strength: 80,
      speed: 70,
      durability: 75,
      intelligence: 60,
      auraCapacity: 85,
      auraControl: 80,
      experience: 90,
    },
  };

  it("should calculate weighted score correctly", () => {
    const { score, breakdown } = calculateWeightedScore(mockFighter);

    // Manual calculation:
    // strength: 80 * 0.18 = 14.4
    // speed: 70 * 0.16 = 11.2
    // durability: 75 * 0.16 = 12.0
    // intelligence: 60 * 0.10 = 6.0
    // auraCapacity: 85 * 0.15 = 12.75
    // auraControl: 80 * 0.15 = 12.0
    // experience: 90 * 0.10 = 9.0
    // Total: 77.35

    expect(score).toBeCloseTo(77.35, 2);
    expect(breakdown).toHaveLength(7);
    expect(breakdown[0].stat).toBe("strength");
    expect(breakdown[0].contribution).toBeCloseTo(14.4, 2);
  });

  it("should return correct Nen multiplier for advantages", () => {
    expect(getNenMultiplier("Enhancer", "Transmuter")).toBe(1.06);
    expect(getNenMultiplier("Transmuter", "Conjurer")).toBe(1.06);
    expect(getNenMultiplier("Conjurer", "Manipulator")).toBe(1.06);
    expect(getNenMultiplier("Manipulator", "Emitter")).toBe(1.06);
    expect(getNenMultiplier("Emitter", "Enhancer")).toBe(1.06);
  });

  it("should return 1.0 for no advantage", () => {
    expect(getNenMultiplier("Enhancer", "Enhancer")).toBe(1.0);
    expect(getNenMultiplier("Enhancer", "Emitter")).toBe(1.0);
    expect(getNenMultiplier("Specialist", "Enhancer")).toBe(1.0);
    expect(getNenMultiplier("Enhancer", "Specialist")).toBe(1.0);
  });

  it("should calculate final score with multiplier", () => {
    const weightedScore = 77.35;
    const { finalScore, multiplier } = calculateFinalScore(
      weightedScore,
      "Enhancer",
      "Transmuter"
    );

    expect(multiplier).toBe(1.06);
    expect(finalScore).toBeCloseTo(77.35 * 1.06, 2);
  });

  it("should generate correct Nen explanation", () => {
    expect(getNenExplanation("Enhancer", "Transmuter")).toContain("advantage");
    expect(getNenExplanation("Enhancer", "Enhancer")).toContain("No advantage");
    expect(getNenExplanation("Specialist", "Enhancer")).toContain("no advantage or disadvantage");
  });

  it("should calculate fighter scores correctly", () => {
    const fighterA: Fighter = {
      id: 1,
      name: "Fighter A",
      nenType: "Enhancer",
      baseStats: {
        strength: 80,
        speed: 70,
        durability: 75,
        intelligence: 60,
        auraCapacity: 85,
        auraControl: 80,
        experience: 90,
      },
    };

    const fighterB: Fighter = {
      id: 2,
      name: "Fighter B",
      nenType: "Transmuter",
      baseStats: {
        strength: 70,
        speed: 80,
        durability: 70,
        intelligence: 75,
        auraCapacity: 80,
        auraControl: 85,
        experience: 85,
      },
    };

    const result = calculateFighterScores(fighterA, fighterB);

    expect(result.scoreA.weighted).toBeGreaterThan(0);
    expect(result.scoreB.weighted).toBeGreaterThan(0);
    expect(result.scoreA.multiplier).toBe(1.06); // Enhancer > Transmuter
    expect(result.scoreB.multiplier).toBe(1.0); // Transmuter has no advantage over Enhancer
    expect(result.breakdownA).toHaveLength(7);
    expect(result.breakdownB).toHaveLength(7);
  });
});

