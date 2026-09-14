import { useState, useMemo } from 'react';
import { History, Search, Filter, ChevronDown, AlertCircle, CheckCircle2, XCircle, Clock3 } from 'lucide-react';
import { Card, Badge } from '@/components/ui/Card';
import { incidents } from '@/lib/data';
import { getThreatColor, getThreatBgColor, getIncidentStatusColor, getIncidentStatusLabel } from '@/lib/utils';
import type { ThreatLevel, IncidentStatus } from '@/lib/types';

export function Incidents() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<ThreatLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      const matchSearch = inc.title.toLowerCase().includes(search.toLowerCase()) ||
        inc.id.toLowerCase().includes(search.toLowerCase()) ||
        inc.zone.toLowerCase().includes(search.toLowerCase()) ||
        inc.type.toLowerCase().includes(search.toLowerCase());
      const matchSeverity = severityFilter === 'all' || inc.severity === severityFilter;
      const matchStatus = statusFilter === 'all' || inc.status === statusFilter;
      return matchSearch && matchSeverity && matchStatus;
    });
  }, [search, severityFilter, statusFilter]);

  const stats = {
    total: incidents.length,
    active: incidents.filter((i) => i.status === 'active').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
    investigating: incidents.filter((i) => i.status === 'investigating').length,
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <IncidentStatCard label="Total Incidents" value={stats.total} icon={<History className="w-5 h-5" />} color="#00e5ff" />
        <IncidentStatCard label="Active" value={stats.active} icon={<AlertCircle className="w-5 h-5" />} color="#ff3b3b" pulse />
        <IncidentStatCard label="Investigating" value={stats.investigating} icon={<Clock3 className="w-5 h-5" />} color="#ffcc00" />
        <IncidentStatCard label="Resolved" value={stats.resolved} icon={<CheckCircle2 className="w-5 h-5" />} color="#00ff9d" />
      </div>

      <Card title="Incident Logs" icon={<History className="w-4 h-4" />}
        action={
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/40 hover:bg-slate-800/60 transition-colors border border-slate-700/30"
          >
            <Filter className="w-3.5 h-3.5" /> Filters
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        }
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/30">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, ID, zone, or type..."
              className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none w-full"
            />
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-3 mb-4 p-3 rounded-lg bg-slate-800/20 border border-slate-700/20 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 uppercase">Severity:</span>
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map((s) => (
                <FilterChip key={s} label={s} active={severityFilter === s} onClick={() => setSeverityFilter(s)} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 uppercase">Status:</span>
              {(['all', 'active', 'investigating', 'resolved', 'false_alarm'] as const).map((s) => (
                <FilterChip key={s} label={getIncidentStatusLabel(s)} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
              ))}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">ID</th>
                <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Title</th>
                <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Type</th>
                <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Severity</th>
                <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Status</th>
                <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Zone</th>
                <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inc) => {
                const sevColor = getThreatColor(inc.severity);
                const statusColor = getIncidentStatusColor(inc.status);
                const isExpanded = selected === inc.id;
                return (
                  <>
                    <tr
                      key={inc.id}
                      onClick={() => setSelected(isExpanded ? null : inc.id)}
                      className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3">
                        <span className="text-xs font-mono text-cyan-400">{inc.id}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-sm font-semibold text-slate-200">{inc.title}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs text-slate-400">{inc.type}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge text={inc.severity.toUpperCase()} color={sevColor} />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {inc.status === 'active' && <AlertCircle className="w-3.5 h-3.5" style={{ color: statusColor }} />}
                          {inc.status === 'investigating' && <Clock3 className="w-3.5 h-3.5" style={{ color: statusColor }} />}
                          {inc.status === 'resolved' && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: statusColor }} />}
                          {inc.status === 'false_alarm' && <XCircle className="w-3.5 h-3.5" style={{ color: statusColor }} />}
                          <span className="text-xs font-medium" style={{ color: statusColor }}>
                            {getIncidentStatusLabel(inc.status)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs text-slate-400">{inc.zone}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-mono text-slate-500">{inc.timestamp}</span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-800/20 animate-fade-in">
                        <td colSpan={7} className="py-4 px-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <p className="text-xs font-mono text-slate-500 uppercase mb-1">Description</p>
                              <p className="text-sm text-slate-300 leading-relaxed">{inc.description}</p>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-mono text-slate-500 uppercase">Operator</p>
                                <p className="text-sm text-slate-300">{inc.operator}</p>
                              </div>
                              <div>
                                <p className="text-xs font-mono text-slate-500 uppercase">Severity Level</p>
                                <div className="mt-1">
                                  <Badge text={inc.severity.toUpperCase()} color={sevColor} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Search className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No incidents match your filters</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
          <span className="text-xs font-mono text-slate-500">Showing {filtered.length} of {incidents.length} incidents</span>
          <span className="text-xs font-mono text-slate-600">Last updated: 14:32:45 IST</span>
        </div>
      </Card>
    </div>
  );
}

function IncidentStatCard({ label, value, icon, color, pulse }: { label: string; value: number; icon: React.ReactNode; color: string; pulse?: boolean }) {
  return (
    <div className="glass-card p-5 animate-slide-up" style={{ boxShadow: `0 0 16px ${color}15` }}>
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${pulse ? 'animate-blink' : ''}`}
          style={{ background: `${color}1a`, border: `1px solid ${color}33` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <div>
          <p className="font-display text-2xl font-bold" style={{ color }}>{value}</p>
          <p className="text-xs font-medium tracking-wider uppercase text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
        active
          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
          : 'bg-slate-800/30 text-slate-400 border border-slate-700/30 hover:bg-slate-800/50'
      }`}
    >
      {label === 'all' ? 'All' : label.replace('_', ' ')}
    </button>
  );
}
