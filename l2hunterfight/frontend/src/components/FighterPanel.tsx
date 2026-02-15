import { Fighter, NenType } from "../types";
import "./FighterPanel.css";

const NEN_TYPES: NenType[] = [
  "Enhancer",
  "Emitter",
  "Transmuter",
  "Conjurer",
  "Manipulator",
  "Specialist",
];

const STAT_LABELS: Record<keyof Fighter["baseStats"], string> = {
  strength: "Strength",
  speed: "Speed",
  durability: "Durability",
  intelligence: "Intelligence",
  auraCapacity: "Aura Capacity",
  auraControl: "Aura Control",
  experience: "Experience",
};

interface FighterPanelProps {
  fighter: Fighter;
  onChange: (fighter: Fighter) => void;
  label: string;
}

export default function FighterPanel({
  fighter,
  onChange,
  label,
}: FighterPanelProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...fighter, name: e.target.value });
  };

  const handleNenTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...fighter, nenType: e.target.value as NenType });
  };

  const handleStatChange = (
    stat: keyof Fighter["baseStats"],
    value: number
  ) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    onChange({
      ...fighter,
      baseStats: { ...fighter.baseStats, [stat]: clampedValue },
    });
  };

  return (
    <div className="fighter-panel">
      <h2>{label}</h2>
      <div className="fighter-form">
        <div className="form-group">
          <label htmlFor={`${label}-name`}>Name</label>
          <input
            id={`${label}-name`}
            type="text"
            value={fighter.name}
            onChange={handleNameChange}
            placeholder="Enter fighter name"
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${label}-nenType`}>Nen Type</label>
          <select
            id={`${label}-nenType`}
            value={fighter.nenType}
            onChange={handleNenTypeChange}
          >
            {NEN_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="stats-section">
          <h3>Base Stats (0-100)</h3>
          {Object.entries(STAT_LABELS).map(([stat, label]) => (
            <div key={stat} className="stat-row">
              <label htmlFor={`${label}-${stat}`}>{label}</label>
              <div className="stat-controls">
                <input
                  id={`${label}-${stat}`}
                  type="range"
                  min="0"
                  max="100"
                  value={fighter.baseStats[stat as keyof Fighter["baseStats"]]}
                  onChange={(e) =>
                    handleStatChange(
                      stat as keyof Fighter["baseStats"],
                      parseInt(e.target.value)
                    )
                  }
                  className="stat-slider"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={fighter.baseStats[stat as keyof Fighter["baseStats"]]}
                  onChange={(e) =>
                    handleStatChange(
                      stat as keyof Fighter["baseStats"],
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="stat-input"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

