# Hunter Fight Predictor

A web application that simulates duels between Hunters using a transparent, rule-based, non-random combat scoring system.

## Features

- **Transparent Scoring**: All calculations are deterministic and fully explained
- **Nen Type Advantages**: Implements the Hunter x Hunter nen type advantage system
- **Detailed Breakdowns**: Shows step-by-step calculations for each fighter
- **Dual Input Modes**: Form-based input with sliders or JSON paste mode
- **Beautiful UI**: Modern, responsive design with gradient backgrounds

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + Vite + TypeScript
- **Testing**: Vitest

## Project Structure

```
l2hunterfight/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express server
│   │   ├── types.ts          # TypeScript types
│   │   ├── validation.ts     # Input validation
│   │   ├── scoring.ts        # Scoring calculations
│   │   ├── predictor.ts      # Prediction logic
│   │   ├── scoring.test.ts   # Scoring tests
│   │   └── predictor.test.ts # Predictor tests
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FighterPanel.tsx
│   │   │   ├── FighterPanel.css
│   │   │   ├── ResultsPanel.tsx
│   │   │   └── ResultsPanel.css
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   ├── types.ts
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
└── README.md
```

## Installation & Running

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Running Tests

From the backend directory:
```bash
npm test
```

## API Documentation

### POST /api/predict

Predicts the outcome of a fight between two fighters.

**Request Body:**
```json
{
  "fighterA": {
    "id": 1,
    "name": "Gon Freecss",
    "nenType": "Enhancer",
    "baseStats": {
      "strength": 85,
      "speed": 80,
      "durability": 75,
      "intelligence": 70,
      "auraCapacity": 90,
      "auraControl": 75,
      "experience": 60
    }
  },
  "fighterB": {
    "id": 2,
    "name": "Killua Zoldyck",
    "nenType": "Transmuter",
    "baseStats": {
      "strength": 70,
      "speed": 95,
      "durability": 70,
      "intelligence": 85,
      "auraCapacity": 80,
      "auraControl": 90,
      "experience": 75
    }
  }
}
```

**Response:**
```json
{
  "winner": "fighterA",
  "verdictText": "Gon Freecss wins!",
  "scores": {
    "A": {
      "weighted": 77.35,
      "final": 82.011,
      "multiplier": 1.06
    },
    "B": {
      "weighted": 78.2,
      "final": 78.2,
      "multiplier": 1.0
    }
  },
  "breakdown": {
    "A": [
      {
        "stat": "strength",
        "value": 85,
        "weight": 0.18,
        "contribution": 15.3
      },
      ...
    ],
    "B": [...]
  },
  "nenExplanation": {
    "AtoB": "Enhancer has an advantage over Transmuter (1.06x multiplier)",
    "BtoA": "No advantage relationship between Transmuter and Enhancer (1.0x multiplier)"
  },
  "decisionExplanation": "Gon Freecss wins with a final score of 82.011 vs Killua Zoldyck's 78.2 (difference: 3.81 points, which is >= 3.0 threshold)"
}
```

## Scoring System

### Stat Weights

- **Strength**: 0.18
- **Speed**: 0.16
- **Durability**: 0.16
- **Intelligence**: 0.10
- **Aura Capacity**: 0.15
- **Aura Control**: 0.15
- **Experience**: 0.10

### Nen Type Advantages

The system implements a circular advantage chain:

- **Enhancer** > **Transmuter** (1.06x)
- **Transmuter** > **Conjurer** (1.06x)
- **Conjurer** > **Manipulator** (1.06x)
- **Manipulator** > **Emitter** (1.06x)
- **Emitter** > **Enhancer** (1.06x)
- **Specialist**: No advantage or disadvantage (1.0x vs all)

### Decision Rules

- If the final score difference is **>= 3.0 points**: Clear winner is declared
- If the final score difference is **< 3.0 points**: "Too close to call" (draw)

## Example Fighters

The app includes example fighters that can be loaded using the "Load Example Fighters" button:

- **Gon Freecss** (Enhancer) - High strength and aura capacity
- **Killua Zoldyck** (Transmuter) - High speed and aura control

## Input Validation

All inputs are strictly validated:

- **id**: Must be an integer
- **name**: Must be a non-empty string
- **nenType**: Must be one of the 6 valid nen types
- **baseStats**: All stats must be numbers between 0 and 100 (inclusive)

## Development

### Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## License

ISC

