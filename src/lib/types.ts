export type ModuleKey =
  | 'dashboard'
  | 'analytics'
  | 'incidents'
  | 'zones'
  | 'heatmap'
  | 'cctv'
  | 'predictive'
  | 'behavioral';

export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low' | 'safe';
export type IncidentStatus = 'active' | 'investigating' | 'resolved' | 'false_alarm';
export type ZoneStatus = 'secure' | 'monitoring' | 'alert' | 'breach';

export interface Alert {
  id: string;
  title: string;
  description: string;
  level: ThreatLevel;
  zone: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface Threat {
  id: string;
  type: string;
  confidence: number;
  zone: string;
  severity: ThreatLevel;
  timestamp: string;
  status: IncidentStatus;
}

export interface Incident {
  id: string;
  title: string;
  type: string;
  severity: ThreatLevel;
  status: IncidentStatus;
  zone: string;
  timestamp: string;
  description: string;
  operator: string;
}

export interface Zone {
  id: string;
  name: string;
  riskScore: number;
  status: ZoneStatus;
  cameras: number;
  sensors: number;
  threats: number;
  lastIncident: string;
  description: string;
}

export interface Camera {
  id: string;
  name: string;
  zone: string;
  status: 'online' | 'offline' | 'degraded';
  detections: number;
  motion: boolean;
  personDetected: boolean;
  recording: boolean;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  action: string;
}

export interface HeatmapCell {
  hour: number;
  zone: string;
  intensity: number;
}

export interface PredictionFactor {
  label: string;
  weight: number;
}

export interface PredictedThreat {
  id: string;
  zone: string;
  zoneId: string;
  threatType: string;
  currentRiskScore: number;
  predictedRiskScore: number;
  threatProbability: number;
  aiConfidence: number;
  estimatedTimeToIncident: string;
  trend: 'rising' | 'stable' | 'falling';
  trendDelta: number;
  severity: ThreatLevel;
  reasons: string[];
  factors: PredictionFactor[];
}

export type AnomalyType =
  | 'Loitering'
  | 'Repeated Entry Attempts'
  | 'Restricted Area Movement'
  | 'Unusual Crowd Formation'
  | 'Unattended Object';

export interface BehavioralAnomaly {
  id: string;
  personId: string;
  anomalyType: AnomalyType;
  anomalyScore: number;
  location: string;
  duration: string;
  threatLevel: ThreatLevel;
  timeDetected: string;
  description: string;
  reasons: string[];
  factors: PredictionFactor[];
  cameraId: string;
}

export interface ExplainableAIData {
  riskScore: number;
  aiConfidence: number;
  category: string;
  reasons: string[];
  factors: PredictionFactor[];
}
