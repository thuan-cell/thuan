export enum RatingLevel {
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  WEAK = 'WEAK',
}

export interface KPILevelDetail {
  label: string;
  description: string;
  scorePercent: number; // 1.0 for 100%, 0.8 for 80%, etc.
}

export interface KPIItem {
  id: string;
  code: string; // e.g., 1.1
  name: string;
  maxPoints: number;
  unit?: string; // Fixed: Made optional to match constants.ts definition
  checklist?: string[]; // Added field for detailed bullet points
  criteria: {
    [RatingLevel.GOOD]: KPILevelDetail;
    [RatingLevel.AVERAGE]: KPILevelDetail;
    [RatingLevel.WEAK]: KPILevelDetail;
  };
}

export interface KPICategory {
  id: string;
  name: string;
  items: KPIItem[];
}

export interface EvaluationState {
  [kpiId: string]: {
    level: RatingLevel;
    actualScore: number;
    notes: string;
  };
}