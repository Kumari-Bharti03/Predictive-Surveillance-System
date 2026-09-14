import type { ThreatLevel, IncidentStatus, ZoneStatus } from './types';

export function getThreatColor(level: ThreatLevel): string {
  switch (level) {
    case 'critical': return '#ff3b3b';
    case 'high': return '#ff8c00';
    case 'medium': return '#ffcc00';
    case 'low': return '#3b82f6';
    case 'safe': return '#00ff9d';
  }
}

export function getThreatBgColor(level: ThreatLevel): string {
  switch (level) {
    case 'critical': return 'rgba(255, 59, 59, 0.15)';
    case 'high': return 'rgba(255, 140, 0, 0.15)';
    case 'medium': return 'rgba(255, 204, 0, 0.15)';
    case 'low': return 'rgba(59, 130, 246, 0.15)';
    case 'safe': return 'rgba(0, 255, 157, 0.15)';
  }
}

export function getZoneStatusColor(status: ZoneStatus): string {
  switch (status) {
    case 'secure': return '#00ff9d';
    case 'monitoring': return '#00e5ff';
    case 'alert': return '#ffcc00';
    case 'breach': return '#ff3b3b';
  }
}

export function getZoneStatusBg(status: ZoneStatus): string {
  switch (status) {
    case 'secure': return 'rgba(0, 255, 157, 0.12)';
    case 'monitoring': return 'rgba(0, 229, 255, 0.12)';
    case 'alert': return 'rgba(255, 204, 0, 0.12)';
    case 'breach': return 'rgba(255, 59, 59, 0.12)';
  }
}

export function getIncidentStatusColor(status: IncidentStatus): string {
  switch (status) {
    case 'active': return '#ff3b3b';
    case 'investigating': return '#ffcc00';
    case 'resolved': return '#00ff9d';
    case 'false_alarm': return '#64748b';
  }
}

export function getIncidentStatusLabel(status: IncidentStatus | 'all'): string {
  switch (status) {
    case 'active': return 'Active';
    case 'investigating': return 'Investigating';
    case 'resolved': return 'Resolved';
    case 'false_alarm': return 'False Alarm';
    case 'all': return 'All';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent': return '#ff3b3b';
    case 'high': return '#ff8c00';
    case 'medium': return '#ffcc00';
    case 'low': return '#00e5ff';
    default: return '#00e5ff';
  }
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour12: false });
}

export function getHeatmapColor(intensity: number): string {
  if (intensity < 0.2) return 'rgba(0, 229, 255, 0.08)';
  if (intensity < 0.4) return 'rgba(0, 229, 255, 0.2)';
  if (intensity < 0.55) return 'rgba(255, 204, 0, 0.35)';
  if (intensity < 0.7) return 'rgba(255, 140, 0, 0.5)';
  if (intensity < 0.85) return 'rgba(255, 59, 59, 0.65)';
  return 'rgba(255, 59, 59, 0.85)';
}
