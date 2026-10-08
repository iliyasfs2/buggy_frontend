import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'scratch', 'db.json');

export interface DBState {
  totalXP: number;
  streak: number;
  battery: number;
  completed_nodes: string[];
  unlocked_nodes: string[];
}

const defaultState: DBState = {
  totalXP: 1250,
  streak: 14,
  battery: 5,
  completed_nodes: [],
  unlocked_nodes: ["js-1-1"]
};

export function readDB(): DBState {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading DB", err);
  }
  return defaultState;
}

export function writeDB(state: DBState) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error("Error writing DB", err);
  }
}
