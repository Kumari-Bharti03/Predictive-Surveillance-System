export type ModuleKey =
  | 'dashboard'
  | 'analytics'
  | 'incidents'
  | 'zones'
  | 'heatmap'
  | 'cctv';

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
