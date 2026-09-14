import type {
  Alert,
  Threat,
  Incident,
  Zone,
  Camera,
  AIRecommendation,
  HeatmapCell,
} from './types';

export const zones: Zone[] = [
  { id: 'Z-01', name: 'Perimeter Alpha', riskScore: 78, status: 'alert', cameras: 8, sensors: 12, threats: 3, lastIncident: '2 min ago', description: 'North perimeter fence line and gate' },
  { id: 'Z-02', name: 'Central Plaza', riskScore: 34, status: 'secure', cameras: 12, sensors: 8, threats: 0, lastIncident: '4h ago', description: 'Main courtyard and assembly area' },
  { id: 'Z-03', name: 'Server Room', riskScore: 92, status: 'breach', cameras: 6, sensors: 18, threats: 5, lastIncident: 'Active', description: 'Critical data infrastructure zone' },
  { id: 'Z-04', name: 'Parking Garage', riskScore: 61, status: 'monitoring', cameras: 10, sensors: 6, threats: 2, lastIncident: '18 min ago', description: 'Underground vehicle storage levels B1-B3' },
  { id: 'Z-05', name: 'East Wing', riskScore: 45, status: 'monitoring', cameras: 7, sensors: 9, threats: 1, lastIncident: '1h ago', description: 'Administrative offices and corridors' },
  { id: 'Z-06', name: 'Loading Dock', riskScore: 70, status: 'alert', cameras: 5, sensors: 10, threats: 4, lastIncident: '5 min ago', description: 'Freight entrance and staging area' },
  { id: 'Z-07', name: 'Rooftop Access', riskScore: 28, status: 'secure', cameras: 4, sensors: 5, threats: 0, lastIncident: '2d ago', description: 'Upper-level maintenance access points' },
  { id: 'Z-08', name: 'South Corridor', riskScore: 55, status: 'monitoring', cameras: 9, sensors: 7, threats: 1, lastIncident: '32 min ago', description: 'Primary south-side transit corridor' },
];

export const alerts: Alert[] = [
  { id: 'A-001', title: 'Unauthorized Access Detected', description: 'Motion sensor tripped in restricted Server Room zone. Individual not in authorized personnel database.', level: 'critical', zone: 'Server Room', timestamp: '14:32:08', acknowledged: false },
  { id: 'A-002', title: 'Perimeter Breach Alert', description: 'Fence vibration sensor detected intrusion attempt at North gate. Physical breach confirmed.', level: 'critical', zone: 'Perimeter Alpha', timestamp: '14:30:45', acknowledged: false },
  { id: 'A-003', title: 'Suspicious Package Identified', description: 'AI object detection flagged unattended bag at Loading Dock for >15 minutes.', level: 'high', zone: 'Loading Dock', timestamp: '14:25:12', acknowledged: false },
  { id: 'A-004', title: 'Loitering Behavior Flagged', description: 'Person detected in Parking Garage B2 for 45+ minutes without vehicle interaction.', level: 'medium', zone: 'Parking Garage', timestamp: '14:18:33', acknowledged: true },
  { id: 'A-005', title: 'Camera Signal Degraded', description: 'Camera CAM-07 experiencing intermittent signal loss. Maintenance recommended.', level: 'low', zone: 'East Wing', timestamp: '14:05:00', acknowledged: true },
  { id: 'A-006', title: 'Tailgating Detected', description: 'Two individuals entered South Corridor on single badge swipe. Access policy violation.', level: 'high', zone: 'South Corridor', timestamp: '13:58:22', acknowledged: true },
  { id: 'A-007', title: 'After-Hours Access', description: 'Badge reader activated in East Wing outside scheduled hours. Investigating credentials.', level: 'medium', zone: 'East Wing', timestamp: '13:42:15', acknowledged: true },
];

export const threats: Threat[] = [
  { id: 'T-001', type: 'Intrusion', confidence: 94, zone: 'Server Room', severity: 'critical', timestamp: '14:32:08', status: 'active' },
  { id: 'T-002', type: 'Perimeter Breach', confidence: 89, zone: 'Perimeter Alpha', severity: 'critical', timestamp: '14:30:45', status: 'active' },
  { id: 'T-003', type: 'Unattended Object', confidence: 76, zone: 'Loading Dock', severity: 'high', timestamp: '14:25:12', status: 'investigating' },
  { id: 'T-004', type: 'Loitering', confidence: 68, zone: 'Parking Garage', severity: 'medium', timestamp: '14:18:33', status: 'investigating' },
  { id: 'T-005', type: 'Tailgating', confidence: 82, zone: 'South Corridor', severity: 'high', timestamp: '13:58:22', status: 'investigating' },
  { id: 'T-006', type: 'After-Hours Access', confidence: 71, zone: 'East Wing', severity: 'medium', timestamp: '13:42:15', status: 'investigating' },
  { id: 'T-007', type: 'Device Tampering', confidence: 85, zone: 'Loading Dock', severity: 'high', timestamp: '13:35:00', status: 'active' },
  { id: 'T-008', type: 'Suspicious Vehicle', confidence: 63, zone: 'Parking Garage', severity: 'medium', timestamp: '13:20:45', status: 'resolved' },
  { id: 'T-009', type: 'False Alarm', confidence: 45, zone: 'East Wing', severity: 'low', timestamp: '12:55:30', status: 'false_alarm' },
  { id: 'T-010', type: 'Drone Detected', confidence: 79, zone: 'Rooftop Access', severity: 'high', timestamp: '12:30:15', status: 'resolved' },
];

export const incidents: Incident[] = [
  { id: 'INC-2024-0341', title: 'Server Room Unauthorized Entry', type: 'Intrusion', severity: 'critical', status: 'active', zone: 'Server Room', timestamp: '2024-09-13 14:32:08', description: 'Individual detected inside Server Room without badge authentication. AI confidence 94%. Lockdown protocol initiated.', operator: 'Sentinel AI' },
  { id: 'INC-2024-0340', title: 'North Gate Perimeter Breach', type: 'Perimeter Breach', severity: 'critical', status: 'active', zone: 'Perimeter Alpha', timestamp: '2024-09-13 14:30:45', description: 'Fence vibration sensors detected physical breach attempt at North perimeter gate. Security team dispatched.', operator: 'Capt. R. Mehta' },
  { id: 'INC-2024-0339', title: 'Unattended Package at Loading Dock', type: 'Unattended Object', severity: 'high', status: 'investigating', zone: 'Loading Dock', timestamp: '2024-09-13 14:25:12', description: 'AI object detection flagged unattended bag for 15+ minutes. EOD team notified for assessment.', operator: 'Sentinel AI' },
  { id: 'INC-2024-0338', title: 'Extended Loitering in Parking B2', type: 'Loitering', severity: 'medium', status: 'investigating', zone: 'Parking Garage', timestamp: '2024-09-13 14:18:33', description: 'Person detected in Parking Garage B2 for 45 minutes without vehicle interaction. Behavioral analysis ongoing.', operator: 'Sgt. A. Kumar' },
  { id: 'INC-2024-0337', title: 'Tailgating at South Corridor', type: 'Tailgating', severity: 'high', status: 'investigating', zone: 'South Corridor', timestamp: '2024-09-13 13:58:22', description: 'Two individuals entered on single badge swipe. CCTV review in progress to identify second person.', operator: 'Lt. S. Patel' },
  { id: 'INC-2024-0336', title: 'Camera CAM-07 Signal Loss', type: 'Equipment Failure', severity: 'low', status: 'resolved', zone: 'East Wing', timestamp: '2024-09-13 14:05:00', description: 'Intermittent signal degradation on CAM-07. Maintenance replaced faulty connector. Camera restored.', operator: 'Tech. V. Rao' },
  { id: 'INC-2024-0335', title: 'After-Hours Badge Access', type: 'Access Violation', severity: 'medium', status: 'resolved', zone: 'East Wing', timestamp: '2024-09-13 13:42:15', description: 'Badge reader activated outside scheduled hours. Verified as authorized maintenance contractor.', operator: 'Capt. R. Mehta' },
  { id: 'INC-2024-0334', title: 'Device Tampering at Loading Dock', type: 'Tampering', severity: 'high', status: 'active', zone: 'Loading Dock', timestamp: '2024-09-13 13:35:00', description: 'Sensor housing tampered with at Loading Dock sensor array SNS-12. Physical inspection required.', operator: 'Sentinel AI' },
  { id: 'INC-2024-0333', title: 'Suspicious Vehicle in Parking B1', type: 'Suspicious Vehicle', severity: 'medium', status: 'resolved', zone: 'Parking Garage', timestamp: '2024-09-13 13:20:45', description: 'Vehicle parked in restricted spot for 2+ hours. Owner identified and cleared by security.', operator: 'Sgt. A. Kumar' },
  { id: 'INC-2024-0332', title: 'Drone Sighted Near Rooftop', type: 'Aerial Intrusion', severity: 'high', status: 'resolved', zone: 'Rooftop Access', timestamp: '2024-09-13 12:30:15', description: 'Unauthorized drone detected hovering near rooftop access points. Signal jammed, drone landed.', operator: 'Lt. S. Patel' },
  { id: 'INC-2024-0331', title: 'False Alarm - East Wing Motion', type: 'False Alarm', severity: 'low', status: 'false_alarm', zone: 'East Wing', timestamp: '2024-09-13 12:55:30', description: 'Motion sensor triggered by HVAC vent movement. No threat identified. Sensor recalibrated.', operator: 'Sentinel AI' },
  { id: 'INC-2024-0330', title: 'Unauthorized Badge Attempt', type: 'Access Violation', severity: 'medium', status: 'resolved', zone: 'South Corridor', timestamp: '2024-09-13 11:45:00', description: 'Expired badge used 3 times at South Corridor access point. Badge holder identified and notified.', operator: 'Capt. R. Mehta' },
  { id: 'INC-2024-0329', title: 'Fluid Leak in Server Room', type: 'Environmental', severity: 'high', status: 'resolved', zone: 'Server Room', timestamp: '2024-09-13 10:20:00', description: 'Coolant leak detected near Server Room HVAC unit. Maintenance contained leak, systems secured.', operator: 'Tech. V. Rao' },
  { id: 'INC-2024-0328', title: 'Crowd Density Exceeded', type: 'Crowd Control', severity: 'medium', status: 'resolved', zone: 'Central Plaza', timestamp: '2024-09-13 09:15:00', description: 'Central Plaza crowd density exceeded threshold during morning assembly. Flow redirected.', operator: 'Sgt. A. Kumar' },
  { id: 'INC-2024-0327', title: 'Fire Alarm - False Trigger', type: 'False Alarm', severity: 'low', status: 'false_alarm', zone: 'Parking Garage', timestamp: '2024-09-13 08:30:00', description: 'Smoke detector triggered by vehicle exhaust in Parking Garage B1. No fire detected.', operator: 'Sentinel AI' },
];

export const cameras: Camera[] = [
  { id: 'CAM-01', name: 'North Gate Primary', zone: 'Perimeter Alpha', status: 'online', detections: 3, motion: true, personDetected: true, recording: true },
  { id: 'CAM-02', name: 'North Gate Secondary', zone: 'Perimeter Alpha', status: 'online', detections: 1, motion: false, personDetected: false, recording: true },
  { id: 'CAM-03', name: 'Central Plaza Main', zone: 'Central Plaza', status: 'online', detections: 12, motion: true, personDetected: true, recording: true },
  { id: 'CAM-04', name: 'Central Plaza East', zone: 'Central Plaza', status: 'online', detections: 8, motion: true, personDetected: true, recording: true },
  { id: 'CAM-05', name: 'Server Room Entry', zone: 'Server Room', status: 'online', detections: 1, motion: true, personDetected: true, recording: true },
  { id: 'CAM-06', name: 'Server Room Interior', zone: 'Server Room', status: 'online', detections: 1, motion: true, personDetected: true, recording: true },
  { id: 'CAM-07', name: 'East Wing Corridor', zone: 'East Wing', status: 'degraded', detections: 0, motion: false, personDetected: false, recording: false },
  { id: 'CAM-08', name: 'Parking B1 Entry', zone: 'Parking Garage', status: 'online', detections: 5, motion: true, personDetected: true, recording: true },
  { id: 'CAM-09', name: 'Parking B2 Main', zone: 'Parking Garage', status: 'online', detections: 2, motion: true, personDetected: true, recording: true },
  { id: 'CAM-10', name: 'Loading Dock Primary', zone: 'Loading Dock', status: 'online', detections: 4, motion: true, personDetected: true, recording: true },
  { id: 'CAM-11', name: 'Loading Dock Secondary', zone: 'Loading Dock', status: 'online', detections: 2, motion: false, personDetected: false, recording: true },
  { id: 'CAM-12', name: 'Rooftop Access North', zone: 'Rooftop Access', status: 'online', detections: 0, motion: false, personDetected: false, recording: true },
  { id: 'CAM-13', name: 'South Corridor Main', zone: 'South Corridor', status: 'online', detections: 6, motion: true, personDetected: true, recording: true },
  { id: 'CAM-14', name: 'South Corridor Exit', zone: 'South Corridor', status: 'offline', detections: 0, motion: false, personDetected: false, recording: false },
  { id: 'CAM-15', name: 'Central Plaza North', zone: 'Central Plaza', status: 'online', detections: 7, motion: true, personDetected: true, recording: true },
  { id: 'CAM-16', name: 'Perimeter East Wall', zone: 'Perimeter Alpha', status: 'online', detections: 0, motion: false, personDetected: false, recording: true },
];

export const recommendations: AIRecommendation[] = [
  { id: 'R-01', title: 'Initiate Server Room Lockdown', description: 'Critical threat detected with 94% confidence. Immediate lockdown of all Server Room access points recommended.', priority: 'urgent', action: 'Activate Lockdown' },
  { id: 'R-02', title: 'Dispatch Response Team to North Gate', description: 'Perimeter breach confirmed. Nearest response team ETA 3 minutes. Recommend immediate dispatch.', priority: 'urgent', action: 'Dispatch Team' },
  { id: 'R-03', title: 'Deploy EOD to Loading Dock', description: 'Unattended package flagged for 15+ minutes. EOD assessment recommended before resuming operations.', priority: 'high', action: 'Deploy EOD' },
  { id: 'R-04', title: 'Increase Parking Garage Patrols', description: 'Loitering pattern detected. Recommend increasing patrol frequency from 30 to 15 minute intervals.', priority: 'medium', action: 'Adjust Patrols' },
  { id: 'R-05', title: 'Schedule CAM-07 Maintenance', description: 'Camera signal degraded. Recommend scheduling maintenance window within 2 hours.', priority: 'low', action: 'Schedule Repair' },
];

export const threatTypeBreakdown = [
  { type: 'Intrusion', count: 14, color: '#ff3b3b' },
  { type: 'Perimeter Breach', count: 9, color: '#ff8c00' },
  { type: 'Loitering', count: 22, color: '#ffcc00' },
  { type: 'Unattended Object', count: 7, color: '#3b82f6' },
  { type: 'Tailgating', count: 11, color: '#00e5ff' },
  { type: 'Access Violation', count: 18, color: '#a78bfa' },
  { type: 'Tampering', count: 5, color: '#ff6b9d' },
  { type: 'Aerial Intrusion', count: 3, color: '#00ff9d' },
];

export const weeklyIncidentTrends = [
  { day: 'Mon', critical: 2, high: 5, medium: 8, low: 12 },
  { day: 'Tue', critical: 1, high: 7, medium: 10, low: 9 },
  { day: 'Wed', critical: 3, high: 4, medium: 6, low: 14 },
  { day: 'Thu', critical: 0, high: 6, medium: 9, low: 11 },
  { day: 'Fri', critical: 4, high: 8, medium: 12, low: 7 },
  { day: 'Sat', critical: 2, high: 3, medium: 5, low: 8 },
  { day: 'Sun', critical: 1, high: 2, medium: 4, low: 6 },
];

export const riskScoreProgression = [
  { time: '08:00', score: 22 },
  { time: '09:00', score: 28 },
  { time: '10:00', score: 35 },
  { time: '11:00', score: 30 },
  { time: '12:00', score: 42 },
  { time: '13:00', score: 55 },
  { time: '14:00', score: 68 },
  { time: '14:32', score: 87 },
];

export const zoneRiskRadar = [
  { zone: 'Perimeter', value: 78 },
  { zone: 'Central', value: 34 },
  { zone: 'Server', value: 92 },
  { zone: 'Parking', value: 61 },
  { zone: 'East', value: 45 },
  { zone: 'Loading', value: 70 },
  { zone: 'Rooftop', value: 28 },
  { zone: 'South', value: 55 },
];

export const aiPredictionMatrix = [
  { zone: 'Server Room', probability: 87, threat: 'Intrusion', timeframe: '< 1h', confidence: 'high' },
  { zone: 'Loading Dock', probability: 72, threat: 'Tampering', timeframe: '1-2h', confidence: 'high' },
  { zone: 'Perimeter Alpha', probability: 81, threat: 'Breach', timeframe: '< 30m', confidence: 'critical' },
  { zone: 'Parking Garage', probability: 54, threat: 'Loitering', timeframe: '2-4h', confidence: 'medium' },
  { zone: 'South Corridor', probability: 48, threat: 'Tailgating', timeframe: '2-4h', confidence: 'medium' },
  { zone: 'East Wing', probability: 31, threat: 'Access Violation', timeframe: '4-8h', confidence: 'low' },
  { zone: 'Central Plaza', probability: 18, threat: 'Crowd', timeframe: '8h+', confidence: 'low' },
  { zone: 'Rooftop Access', probability: 12, threat: 'Aerial', timeframe: '8h+', confidence: 'low' },
];

export const heatmapData: HeatmapCell[] = (() => {
  const zoneNames = zones.map((z) => z.name);
  const cells: HeatmapCell[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const zoneName of zoneNames) {
      let intensity = Math.random() * 0.3;
      if (hour >= 8 && hour <= 18) intensity += Math.random() * 0.3;
      if (hour >= 13 && hour <= 15) intensity += Math.random() * 0.3;
      if (zoneName === 'Server Room' || zoneName === 'Loading Dock') intensity += 0.2;
      if (zoneName === 'Server Room' && hour >= 14 && hour <= 15) intensity = 0.9 + Math.random() * 0.1;
      cells.push({ hour, zone: zoneName, intensity: Math.min(intensity, 1) });
    }
  }
  return cells;
})();

export const facilityHotspots = [
  { name: 'Server Room Entry', x: 45, y: 35, intensity: 0.95, radius: 28 },
  { name: 'North Gate', x: 50, y: 8, intensity: 0.82, radius: 24 },
  { name: 'Loading Dock', x: 82, y: 72, intensity: 0.78, radius: 26 },
  { name: 'Parking B2', x: 25, y: 65, intensity: 0.55, radius: 20 },
  { name: 'South Corridor', x: 50, y: 88, intensity: 0.45, radius: 18 },
  { name: 'East Wing', x: 78, y: 40, intensity: 0.38, radius: 16 },
  { name: 'Central Plaza', x: 50, y: 50, intensity: 0.22, radius: 22 },
];

export const facilityLayout = [
  { label: 'Server Room', x: 45, y: 35, w: 10, h: 12 },
  { label: 'North Gate', x: 48, y: 5, w: 4, h: 3 },
  { label: 'Loading Dock', x: 78, y: 70, w: 12, h: 8 },
  { label: 'Parking B1-B3', x: 15, y: 55, w: 18, h: 20 },
  { label: 'East Wing', x: 75, y: 35, w: 12, h: 15 },
  { label: 'Central Plaza', x: 42, y: 45, w: 16, h: 12 },
  { label: 'South Corridor', x: 45, y: 82, w: 10, h: 6 },
  { label: 'Rooftop Access', x: 82, y: 12, w: 8, h: 6 },
];

export const systemStats = {
  overallRisk: 87,
  activeThreats: 5,
  peopleDetected: 47,
  secureZones: 2,
  totalZones: 8,
  totalCameras: 16,
  onlineCameras: 14,
  totalSensors: 75,
  activeSensors: 72,
  systemUptime: '99.7%',
  lastScan: '14:32:45',
  aiModelVersion: 'Sentinel v4.2.1',
};
