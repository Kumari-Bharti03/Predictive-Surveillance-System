import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  scan?: boolean;
}

export function Card({ children, className = '', title, icon, action, scan = false }: CardProps) {
  return (
    <div className={`glass-card ${scan ? 'scan-line' : ''} ${className} animate-fade-in`}>
      {title && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(0,229,255,0.08)]">
          <div className="flex items-center gap-2">
            {icon && <span className="text-cyan-400">{icon}</span>}
            <h3 className="font-display text-sm font-semibold tracking-wide text-slate-200 uppercase">
              {title}
            </h3>
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  trend?: string;
  trendUp?: boolean;
  glow?: boolean;
}

export function StatCard({ label, value, icon, color, trend, trendUp, glow = true }: StatCardProps) {
  return (
    <div
      className="glass-card relative overflow-hidden p-5 animate-slide-up group"
      style={glow ? { boxShadow: `0 0 20px ${color}22` } : undefined}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
        style={{ background: color }}
      />
      <div className="relative flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center"
          style={{ background: `${color}1a`, border: `1px solid ${color}33` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        {trend && (
          <span
            className="text-xs font-mono font-semibold px-2 py-0.5 rounded"
            style={{
              color: trendUp ? '#00ff9d' : '#ff3b3b',
              background: trendUp ? 'rgba(0,255,157,0.1)' : 'rgba(255,59,59,0.1)',
            }}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="relative">
        <p className="font-display text-3xl font-bold tracking-tight" style={{ color }}>
          {value}
        </p>
        <p className="text-xs font-medium tracking-wider uppercase text-slate-400 mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}

interface BadgeProps {
  text: string;
  color: string;
  bgColor?: string;
  pulse?: boolean;
}

export function Badge({ text, color, bgColor, pulse = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${pulse ? 'animate-blink' : ''}`}
      style={{
        color,
        background: bgColor || `${color}1a`,
        border: `1px solid ${color}33`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {text}
    </span>
  );
}
