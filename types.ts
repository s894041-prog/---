
export interface AnalysisBreakdown {
  bloodPressure: string;
  sugarStarch: string;
  fatWeight: string;
  acidReflux: string;
}

export interface AnalysisResult {
  evaluation: '綠燈' | '黃燈' | '紅燈';
  breakdown: AnalysisBreakdown;
  support: string;
  timestamp: Date;
  imageUrl?: string;
  description?: string;
}

export interface UserProfile {
  age: number;
  role: string;
  bloodPressure: string;
  conditions: string[];
}
