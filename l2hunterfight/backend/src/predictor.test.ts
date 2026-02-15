import { describe, it, expect } from "vitest";
import { predictFight } from "./predictor";
import { Fighter } from "./types";

describe("Predictor Logic", () => {
  const createFighter = (
    name: string,
    nenType: Fighter["nenType"],
    stats: Partial<Fighter["baseStats"]>
  ): Fighter => {
    return {
      id: 1,
      name,
      nenType,
      baseStats: {
        strength: stats.strength ?? 50,
        speed: stats.speed ?? 50,
        durability: stats.durability ?? 50,
        intelligence: stats.intelligence ?? 50,
        auraCapacity: stats.auraCapacity ?? 50,
        auraControl: stats.auraControl ?? 50,
        experience: stats.experience ?? 50,
      },
    };
  };

  it("should declare clear winner when score difference >= 3.0", () => {
    const fighterA = createFighter("Strong Fighter", "Enhancer", {
      strength: 100,
      speed: 100,
      durability: 100,
      intelligence: 100,
      auraCapacity: 100,
      auraControl: 100,
      experience: 100,
    });

    const fighterB = createFighter("Weak Fighter", "Emitter", {
      strength: 10,
      speed: 10,
      durability: 10,
      intelligence: 10,
      auraCapacity: 10,
      auraControl: 10,
      experience: 10,
    });

    const result = predictFight(fighterA, fighterB);

    expect(result.winner).toBe("fighterA");
    expect(result.verdictText).toContain("wins");
    expect(result.decisionExplanation).toContain(">=");
  });

  it("should declare draw when score difference < 3.0", () => {
    const fighterA = createFighter("Fighter A", "Enhancer", {
      strength: 50,
      speed: 50,
      durability: 50,
      intelligence: 50,
      auraCapacity: 50,
      auraControl: 50,
      experience: 50,
    });

    const fighterB = createFighter("Fighter B", "Emitter", {
      strength: 51,
      speed: 51,
      durability: 51,
      intelligence: 51,
      auraCapacity: 51,
      auraControl: 51,
      experience: 51,
    });

    const result = predictFight(fighterA, fighterB);

    expect(result.winner).toBe("draw");
    expect(result.verdictText).toContain("Too close to call");
    expect(result.decisionExplanation).toContain("<");
  });

  it("should include all required fields in response", () => {
    const fighterA = createFighter("Fighter A", "Enhancer", {});
    const fighterB = createFighter("Fighter B", "Emitter", {});

    const result = predictFight(fighterA, fighterB);

    expect(result).toHaveProperty("winner");
    expect(result).toHaveProperty("verdictText");
    expect(result).toHaveProperty("scores");
    expect(result).toHaveProperty("breakdown");
    expect(result).toHaveProperty("nenExplanation");
    expect(result).toHaveProperty("decisionExplanation");

    expect(result.scores).toHaveProperty("A");
    expect(result.scores).toHaveProperty("B");
    expect(result.breakdown).toHaveProperty("A");
    expect(result.breakdown).toHaveProperty("B");
    expect(result.nenExplanation).toHaveProperty("AtoB");
    expect(result.nenExplanation).toHaveProperty("BtoA");
  });
});

