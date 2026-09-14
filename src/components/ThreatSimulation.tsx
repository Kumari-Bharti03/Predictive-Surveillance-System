import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, X, Video, ScanFace, Activity, Brain, GitBranch,
  CheckCircle2, Zap, Shield, Siren, Clock, Target, Cpu,
  AlertTriangle, ArrowDown, Lock, Users, Eye, TrendingUp,
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ThreatSimulationProps {
  open: boolean;
  onClose: () => void;
}

interface SimStep {
  id: number;
  title: string;
  subtitle: string;
  icon: typeof Video;
  color: string;
  duration: number;
}

const SIM_STEPS: SimStep[] = [
  { id: 1, title: 'CCTV Detection', subtitle: 'Suspicious individual detected near North Gate', icon: Video, color: '#00e5ff', duration: 3000 },
  { id: 2, title: 'Behavioral Anomaly Detection', subtitle: 'AI analyzing loitering and entry attempt patterns', icon: ScanFace, color: '#a78bfa', duration: 3500 },
  { id: 3, title: 'Threat Analytics Update', subtitle: 'Risk score recalculated with threat probability', icon: Activity, color: '#ff8c00', duration: 3000 },
  { id: 4, title: 'Predictive Alert Center', subtitle: 'AI forecasts escalation within 30 minutes', icon: Brain, color: '#ff3b3b', duration: 3500 },
  { id: 5, title: 'Escalation Timeline', subtitle: 'Threat progression from loitering to critical alert', icon: GitBranch, color: '#ff3b3b', duration: 4000 },
  { id: 6, title: 'Explainable AI Analysis', subtitle: 'AI reasoning and contributing factors', icon: CheckCircle2, color: '#00e5ff', duration: 3000 },
  { id: 7, title: 'AI Response Recommendations', subtitle: 'Auto-generated security action plan', icon: Zap, color: '#ff8c00', duration: 3500 },
  { id: 8, title: 'Threat Prevented', subtitle: 'Final simulation summary', icon: Shield, color: '#00ff9d', duration: 4000 },
];

const ESCALATION_EVENTS = [
  { title: 'Loitering Detected', desc: 'Individual detected near North Gate for 20+ minutes', score: 28, color: '#3b82f6' },
  { title: 'Repeated Access Attempts', desc: '4 badge attempts at North Gate reader — all rejected', score: 52, color: '#ffcc00' },
  { title: 'Restricted Zone Movement', desc: 'Motion detected inside perimeter boundary without auth', score: 74, color: '#ff8c00' },
  { title: 'Threat Escalation', desc: 'AI confirms intrusion attempt — 94% pattern match', score: 89, color: '#ff3b3b' },
  { title: 'Critical Alert Generated', desc: 'Lockdown protocol activated — security team dispatched', score: 96, color: '#ff3b3b' },
];

const ANOMALY_FACTORS = [
  { label: 'Loitering for 20+ minutes', delay: 0 },
  { label: 'Multiple entry attempts', delay: 400 },
  { label: 'Movement near restricted area', delay: 800 },
];

const XAI_REASONS = [
  'Loitering behavior detected',
  'Repeated entry attempts',
  'Presence near restricted area',
  'Activity during unusual hours',
];

const RESPONSE_ACTIONS = [
  { title: 'Deploy Security Team', icon: Users, effectiveness: 96, confidence: 94, delay: 0 },
  { title: 'Increase Camera Monitoring', icon: Eye, effectiveness: 88, confidence: 89, delay: 500 },
  { title: 'Lock Nearby Access Points', icon: Lock, effectiveness: 92, confidence: 91, delay: 1000 },
];

export function ThreatSimulation({ open, onClose }: ThreatSimulationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [anomalyScore, setAnomalyScore] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [visibleEscalationEvents, setVisibleEscalationEvents] = useState(0);
  const [visibleXaiReasons, setVisibleXaiReasons] = useState(0);
  const [visibleActions, setVisibleActions] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [notifications, setNotifications] = useState<{ id: number; text: string; color: string }[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const addNotification = useCallback((text: string, color: string) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, text, color }]);
    const t = setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
    timersRef.current.push(t);
  }, []);

  const reset = useCallback(() => {
    clearAllTimers();
    setCurrentStep(0);
    setIsRunning(false);
    setAnomalyScore(0);
    setRiskScore(0);
    setVisibleEscalationEvents(0);
    setVisibleXaiReasons(0);
    setVisibleActions(0);
    setElapsedTime(0);
    setNotifications([]);
  }, [clearAllTimers]);

  const runStep = useCallback((stepIndex: number) => {
    if (stepIndex >= SIM_STEPS.length) {
      setIsRunning(false);
      return;
    }
    setCurrentStep(stepIndex);
    const step = SIM_STEPS[stepIndex];

    if (stepIndex === 0) {
      addNotification('CCTV: Person detected — North Gate CAM-01', '#00e5ff');
    } else if (stepIndex === 1) {
      addNotification('Anomaly score rising — behavioral analysis active', '#a78bfa');
      let score = 0;
      const interval = setInterval(() => {
        score += 3;
        setAnomalyScore(Math.min(score, 87));
        if (score >= 87) clearInterval(interval);
      }, 80);
      timersRef.current.push(setTimeout(() => clearInterval(interval), 3500) as unknown as ReturnType<typeof setTimeout>);
    } else if (stepIndex === 2) {
      addNotification('Risk score updated — threat probability 87%', '#ff8c00');
      let score = 0;
      const interval = setInterval(() => {
        score += 2;
        setRiskScore(Math.min(score, 89));
        if (score >= 89) clearInterval(interval);
      }, 60);
      timersRef.current.push(setTimeout(() => clearInterval(interval), 3000) as unknown as ReturnType<typeof setTimeout>);
    } else if (stepIndex === 3) {
      addNotification('PREDICTIVE ALERT: North Gate escalation forecast', '#ff3b3b');
    } else if (stepIndex === 4) {
      addNotification('Escalation timeline building — 5 stages detected', '#ff3b3b');
      for (let i = 0; i < 5; i++) {
        const t = setTimeout(() => setVisibleEscalationEvents(i + 1), i * 600);
        timersRef.current.push(t);
      }
    } else if (stepIndex === 5) {
      addNotification('Explainable AI: 4 contributing factors identified', '#00e5ff');
      for (let i = 0; i < 4; i++) {
        const t = setTimeout(() => setVisibleXaiReasons(i + 1), i * 400);
        timersRef.current.push(t);
      }
    } else if (stepIndex === 6) {
      addNotification('AI Response: 3 actions recommended — deploying', '#ff8c00');
      for (let i = 0; i < 3; i++) {
        const t = setTimeout(() => setVisibleActions(i + 1), i * 500);
        timersRef.current.push(t);
      }
    } else if (stepIndex === 7) {
      addNotification('THREAT PREVENTED — Response time: 2 min 14 sec', '#00ff9d');
    }

    const t = setTimeout(() => runStep(stepIndex + 1), step.duration);
    timersRef.current.push(t);
  }, [addNotification]);

  const startSimulation = useCallback(() => {
    reset();
    setIsRunning(true);
    const t = setTimeout(() => runStep(0), 200);
    timersRef.current.push(t);
  }, [reset, runStep]);

  // Elapsed timer
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Cleanup on close
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  useEffect(() => () => clearAllTimers(), [clearAllTimers]);

  if (!open) return null;

  const step = SIM_STEPS[currentStep];
  const StepIcon = step?.icon;
  const formatElapsed = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Notification Toasts */}
      <div className="fixed top-20 right-6 z-50 space-y-2 w-80">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="glass-card p-3 rounded-lg border animate-slide-up flex items-center gap-2"
            style={{ borderColor: `${n.color}44`, boxShadow: `0 0 16px ${n.color}22` }}
          >
            <span className="w-2 h-2 rounded-full pulse-dot shrink-0" style={{ background: n.color }} />
            <span className="text-xs font-mono text-slate-300">{n.text}</span>
          </div>
        ))}
      </div>

      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border-2 border-cyan-500/30"
        style={{ boxShadow: '0 0 60px rgba(0,229,255,0.15)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-[#0d1320]/95 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30">
              <Siren className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold tracking-wide text-cyan-300 uppercase">Live Demo Simulation</h2>
              <p className="text-[10px] font-mono text-slate-500">Sentinel AI Threat Simulation // North Gate Scenario</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isRunning && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-blink" />
                <span className="text-xs font-mono text-red-400 font-semibold">LIVE</span>
                <span className="text-xs font-mono text-slate-400">{formatElapsed(elapsedTime)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 border-b border-slate-800/50 bg-slate-900/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Simulation Progress</span>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">Step {currentStep + 1} of {SIM_STEPS.length}</span>
          </div>
          <div className="flex items-center gap-1">
            {SIM_STEPS.map((s, i) => (
              <div
                key={s.id}
                className="flex-1 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: i <= currentStep ? s.color : 'rgba(148,163,184,0.1)',
                  boxShadow: i <= currentStep ? `0 0 6px ${s.color}66` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 min-h-[400px]">
          {!isRunning && currentStep === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30 mb-6 animate-pulse">
                <Play className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-cyan-300 mb-2">Threat Simulation Ready</h3>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                This simulation demonstrates how Sentinel AI detects, analyzes, predicts, and prevents a security threat
                at the North Gate. The full demo runs approximately 2-3 minutes.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-2xl">
                {SIM_STEPS.slice(0, 4).map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.id} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20 text-center">
                      <Icon className="w-5 h-5 mx-auto mb-1.5" style={{ color: s.color }} />
                      <p className="text-[10px] font-mono text-slate-500 uppercase">{s.title}</p>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={startSimulation}
                className="px-8 py-3 rounded-xl font-display font-bold tracking-wide text-cyan-300 bg-cyan-500/10 border-2 border-cyan-500/40 hover:bg-cyan-500/20 hover:scale-105 transition-all flex items-center gap-2"
                style={{ boxShadow: '0 0 24px rgba(0,229,255,0.2)' }}
              >
                <Play className="w-5 h-5" />
                Start Threat Simulation
              </button>
            </div>
          )}

          {isRunning && step && (
            <div className="space-y-5">
              {/* Current Step Header */}
              <div
                className="flex items-center gap-4 p-4 rounded-xl border animate-scale-in"
                style={{ borderColor: `${step.color}33`, background: `${step.color}0a` }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${step.color}1a`, border: `1px solid ${step.color}44`, boxShadow: `0 0 16px ${step.color}33` }}
                >
                  <StepIcon className="w-7 h-7" style={{ color: step.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-slate-500">STEP {step.id} / {SIM_STEPS.length}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
                      style={{ color: step.color, background: `${step.color}1a`, border: `1px solid ${step.color}33` }}
                    >
                      {step.title.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200">{step.subtitle}</p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin-slow" style={{ borderTopColor: step.color, borderRightColor: step.color }} />
              </div>

              {/* Step Content */}
              {currentStep === 0 && <StepCCTV />}
              {currentStep === 1 && <StepAnomaly anomalyScore={anomalyScore} />}
              {currentStep === 2 && <StepAnalytics riskScore={riskScore} />}
              {currentStep === 3 && <StepPredictive />}
              {currentStep === 4 && <StepEscalation visibleCount={visibleEscalationEvents} />}
              {currentStep === 5 && <StepExplainableAI visibleCount={visibleXaiReasons} />}
              {currentStep === 6 && <StepResponse visibleCount={visibleActions} />}
              {currentStep === 7 && <StepFinal elapsed={formatElapsed(elapsedTime)} />}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-3 border-t border-slate-800/50 bg-[#0d1320]/95 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            {SIM_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: i === currentStep ? `${s.color}22` : i < currentStep ? `${s.color}11` : 'rgba(148,163,184,0.05)',
                    border: `1px solid ${i === currentStep ? s.color : i < currentStep ? `${s.color}33` : 'rgba(148,163,184,0.1)'}`,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: i <= currentStep ? s.color : '#475569' }} />
                </div>
              );
            })}
          </div>
          {isRunning && (
            <button
              onClick={reset}
              className="px-4 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-400 bg-slate-800/50 border border-slate-700/30 hover:text-slate-200 transition-all"
            >
              Reset Simulation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// === Step Components ===

function StepCCTV() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5a animate-slide-up">
        <div className="flex items-center gap-2 mb-3">
          <Video className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wide">CAM-01 // North Gate Primary</span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-blink ml-auto" />
        </div>
        <div className="aspect-video rounded-lg bg-slate-900/60 border border-slate-700/30 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-20 rounded-full border-2 border-cyan-400/60 flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(0,229,255,0.3)' }}>
                <Users className="w-8 h-8 text-cyan-400/60" />
              </div>
              <div className="absolute -top-1 -left-2 text-[9px] font-mono text-cyan-400 bg-cyan-500/20 px-1 rounded">PERSON-01</div>
              <div className="absolute -bottom-5 left-0 right-0 text-center text-[9px] font-mono text-cyan-400">CONF: 94%</div>
            </div>
          </div>
          <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-500">REC ● 14:32:08</div>
          <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-500">CAM-01</div>
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-slate-600">
            <span>NORTH GATE</span>
            <span>1920x1080 // 30fps</span>
          </div>
          <div className="scan-line absolute inset-0" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="p-4 rounded-xl border border-cyan-500/20 bg-slate-800/30 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 uppercase">Detection Notification</span>
          </div>
          <p className="text-sm text-slate-200 font-semibold mb-1">Suspicious Individual Detected</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI object detection has identified a person near the North Gate perimeter fence.
            Individual is not in the authorized personnel database for this zone.
          </p>
        </div>
        <div className="p-4 rounded-xl border border-slate-700/20 bg-slate-800/30 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-500 uppercase">AI Detection Details</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-mono text-slate-500">DETECTION CONFIDENCE</p>
              <p className="text-sm font-display font-bold text-cyan-400">94%</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500">OBJECT CLASS</p>
              <p className="text-sm font-display font-bold text-slate-200">Person</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500">CAMERA</p>
              <p className="text-sm font-mono text-slate-300">CAM-01</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500">ZONE</p>
              <p className="text-sm font-mono text-slate-300">Perimeter Alpha</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepAnomaly({ anomalyScore }: { anomalyScore: number }) {
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-xl border border-violet-500/20 bg-violet-500/5a animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ScanFace className="w-5 h-5 text-violet-400" />
            <span className="text-sm font-mono text-violet-400 uppercase tracking-wide">Behavioral Anomaly Score</span>
          </div>
          <span className="font-display text-3xl font-bold text-violet-400 tabular-nums">{anomalyScore}<span className="text-base text-slate-600">/100</span></span>
        </div>
        <ProgressBar value={anomalyScore} color="#a78bfa" height={8} />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] font-mono text-slate-500">BASELINE</span>
          <span className="text-[10px] font-mono text-violet-400 font-semibold">{anomalyScore > 70 ? 'CRITICAL THRESHOLD EXCEEDED' : anomalyScore > 40 ? 'ELEVATED' : 'MONITORING'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {ANOMALY_FACTORS.map((f, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-violet-500/20 bg-slate-800/30 animate-slide-up flex items-start gap-3"
            style={{ animationDelay: `${f.delay}ms` }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-violet-500/10 border border-violet-500/30">
              <CheckCircle2 className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase mb-0.5">Factor {i + 1}</p>
              <p className="text-sm text-slate-200">{f.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-slate-700/20 bg-slate-800/30">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-mono text-slate-500 uppercase">AI Behavioral Analysis</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Sentinel AI behavioral model has flagged this individual's activity pattern. Loitering duration exceeds
          the 20-minute threshold. Multiple badge attempts suggest unauthorized access intent. Movement trajectory
          indicates approach toward restricted perimeter boundary.
        </p>
      </div>
    </div>
  );
}

function StepAnalytics({ riskScore }: { riskScore: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-5 rounded-xl border border-orange-500/20 bg-orange-500/5a animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-mono text-orange-400 uppercase tracking-wide">Risk Score</span>
          </div>
          <span className="font-display text-3xl font-bold text-orange-400 tabular-nums">{riskScore}</span>
        </div>
        <ProgressBar value={riskScore} color="#ff8c00" height={8} />
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-2 rounded-lg bg-slate-900/40">
            <p className="text-[10px] font-mono text-slate-500">THREAT PROB.</p>
            <p className="text-sm font-display font-bold text-orange-400">{Math.round(riskScore * 0.98)}%</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-900/40">
            <p className="text-[10px] font-mono text-slate-500">AI CONFIDENCE</p>
            <p className="text-sm font-display font-bold text-cyan-400">{Math.round(riskScore * 1.02)}%</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-900/40">
            <p className="text-[10px] font-mono text-slate-500">SEVERITY</p>
            <p className="text-sm font-display font-bold text-red-400">{riskScore > 80 ? 'CRITICAL' : riskScore > 60 ? 'HIGH' : 'MEDIUM'}</p>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-xl border border-slate-700/20 bg-slate-800/30 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-mono text-slate-500 uppercase">Risk Score Progression</span>
        </div>
        <svg viewBox="0 0 100 120" className="w-full" style={{ height: 120 }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="simRiskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 30, 60, 90].map((v) => {
            const y = 100 - v;
            return <line key={v} x1="5" y1={y} x2="95" y2={y} stroke="rgba(148,163,184,0.06)" strokeWidth="0.2" />;
          })}
          <path d="M 5 90 L 25 80 L 45 60 L 65 40 L 85 20 L 95 15" fill="none" stroke="#ff8c00" strokeWidth="0.8" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 3px rgba(255,140,0,0.5))' }} />
          <path d="M 5 90 L 25 80 L 45 60 L 65 40 L 85 20 L 95 15 L 95 100 L 5 100 Z" fill="url(#simRiskGrad)" />
          <circle cx="95" cy="15" r="2" fill="#ff3b3b" className="animate-pulse" />
        </svg>
        <div className="flex justify-between mt-1">
          {['08:00', '10:00', '12:00', '14:00', '14:30', 'NOW'].map((t) => (
            <span key={t} className="text-[9px] font-mono text-slate-600">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepPredictive() {
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5a animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-red-400" />
          <span className="text-sm font-mono text-red-400 uppercase tracking-wide">Predictive Forecast // North Gate</span>
          <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold text-red-400 bg-red-500/10 border border-red-500/30 animate-blink">CRITICAL FORECAST</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <PredictiveMetric label="Current Risk" value="65" color="#ffcc00" />
          <PredictiveMetric label="Predicted Risk" value="89" color="#ff3b3b" />
          <PredictiveMetric label="Threat Probability" value="87%" color="#ff8c00" />
          <PredictiveMetric label="AI Confidence" value="91%" color="#00e5ff" />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-slate-700/20 bg-slate-800/30 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-red-400" />
          <span className="text-xs font-mono text-slate-500 uppercase">AI Prediction Summary</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          Sentinel AI predicts escalation from current risk score 65 to 89 within 30 minutes. Threat probability
          at 87% with 91% AI confidence. Recommended action: immediate preemptive response before escalation occurs.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-slate-500">CURRENT → PREDICTED</span>
              <span className="text-[10px] font-mono text-red-400">+24 POINTS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-yellow-500" style={{ width: '65%' }} />
              </div>
              <ArrowDown className="w-3 h-3 text-slate-600" />
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-red-500 transition-all duration-1000" style={{ width: '89%', boxShadow: '0 0 8px rgba(255,59,59,0.5)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepEscalation({ visibleCount }: { visibleCount: number }) {
  return (
    <div className="relative">
      <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/20 via-yellow-500/30 to-red-500/40" />
      <div className="space-y-2">
        {ESCALATION_EVENTS.map((e, i) => {
          const isVisible = i < visibleCount;
          return (
            <div
              key={i}
              className={`relative pl-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
            >
              <div
                className="absolute left-3 top-2 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10"
                style={{
                  background: '#0d1320',
                  borderColor: e.color,
                  boxShadow: isVisible ? `0 0 12px ${e.color}44` : 'none',
                }}
              >
                <span className="text-xs font-display font-bold" style={{ color: e.color }}>{i + 1}</span>
              </div>
              <div
                className="p-3 rounded-xl border transition-all"
                style={{
                  borderColor: `${e.color}22`,
                  background: `${e.color}0a`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-slate-200">{e.title}</p>
                  <span className="text-xs font-mono font-bold" style={{ color: e.color }}>{e.score}/100</span>
                </div>
                <p className="text-xs text-slate-400">{e.desc}</p>
                <div className="mt-2">
                  <ProgressBar value={e.score} color={e.color} height={3} />
                </div>
              </div>
              {i < ESCALATION_EVENTS.length - 1 && isVisible && (
                <div className="flex items-center gap-1 mt-1 ml-1">
                  <ArrowDown className="w-3 h-3" style={{ color: `${e.color}88` }} />
                  <span className="text-[10px] font-mono text-slate-700">escalating...</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepExplainableAI({ visibleCount }: { visibleCount: number }) {
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5a animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-mono text-cyan-400 uppercase tracking-wide">Explainable AI — Contributing Factors</span>
        </div>
        <div className="space-y-2.5">
          {XAI_REASONS.map((reason, i) => {
            const isVisible = i < visibleCount;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg border border-cyan-500/20 bg-slate-800/30 transition-all duration-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
              >
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="text-sm text-slate-200">{reason}</span>
                <span className="ml-auto text-xs font-mono text-cyan-400/60">FACTOR {String(i + 1).padStart(2, '0')}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-4 rounded-xl border border-slate-700/20 bg-slate-800/30 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-slate-500 uppercase">AI Reasoning Summary</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The AI model identified four contributing factors that collectively indicate a high-probability threat.
          Each factor was weighted against historical incident data and behavioral baselines. The combined risk
          pattern matches 94% of historical intrusion profiles in the Sentinel AI training dataset.
        </p>
      </div>
    </div>
  );
}

function StepResponse({ visibleCount }: { visibleCount: number }) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5a animate-slide-up">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-orange-400" />
          <span className="text-sm font-mono text-orange-400 uppercase tracking-wide">AI-Generated Response Recommendations</span>
        </div>
        <p className="text-xs text-slate-400">Sentinel AI has auto-generated {visibleCount} of 3 recommended actions based on the threat prediction.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RESPONSE_ACTIONS.map((action, i) => {
          const Icon = action.icon;
          const isVisible = i < visibleCount;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border border-orange-500/20 bg-slate-800/30 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ animationDelay: `${action.delay}ms` }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-orange-500/10 border border-orange-500/30">
                <Icon className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-slate-200 mb-3">{action.title}</p>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-500">EFFECTIVENESS</span>
                    <span className="text-xs font-mono font-bold text-green-400">{action.effectiveness}%</span>
                  </div>
                  <ProgressBar value={action.effectiveness} color="#00ff9d" height={3} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-500">AI CONFIDENCE</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">{action.confidence}%</span>
                  </div>
                  <ProgressBar value={action.confidence} color="#00e5ff" height={3} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepFinal({ elapsed }: { elapsed: string }) {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-green-500/10 border-2 border-green-500/40 animate-scale-in" style={{ boxShadow: '0 0 32px rgba(0,255,157,0.3)' }}>
        <Shield className="w-10 h-10 text-green-400" />
      </div>
      <h3 className="font-display text-2xl font-bold text-green-400 mb-2 tracking-wide">THREAT PREVENTED</h3>
      <p className="text-sm text-slate-400 mb-6">Sentinel AI successfully detected, predicted, and prevented a security threat at North Gate.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5a">
          <Shield className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <p className="text-[10px] font-mono text-slate-500 uppercase">Status</p>
          <p className="text-sm font-display font-bold text-green-400">Secure</p>
        </div>
        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5a">
          <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
          <p className="text-[10px] font-mono text-slate-500 uppercase">Response Time</p>
          <p className="text-sm font-display font-bold text-cyan-400">2 min 14 sec</p>
        </div>
        <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5a">
          <Target className="w-5 h-5 text-violet-400 mx-auto mb-2" />
          <p className="text-[10px] font-mono text-slate-500 uppercase">Prediction Accuracy</p>
          <p className="text-sm font-display font-bold text-violet-400">91%</p>
        </div>
        <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5a">
          <Activity className="w-5 h-5 text-orange-400 mx-auto mb-2" />
          <p className="text-[10px] font-mono text-slate-500 uppercase">System Status</p>
          <p className="text-sm font-display font-bold text-orange-400">Operational</p>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl border border-slate-700/20 bg-slate-800/30 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="text-xs font-mono text-slate-500 uppercase">Simulation Summary</span>
        </div>
        <div className="space-y-1.5 text-left">
          {[
            'CCTV detected suspicious individual at North Gate',
            'Behavioral anomaly score reached 87/100',
            'Risk score escalated from 28 to 96 in 24 minutes',
            'AI predicted 87% threat probability with 91% confidence',
            '5-stage escalation timeline generated automatically',
            'Explainable AI identified 4 contributing factors',
            '3 response actions recommended and executed',
            'Threat neutralized — facility secured',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
              <span className="text-xs text-slate-400">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-slate-600">
        <Clock className="w-3.5 h-3.5" />
        <span>Total Simulation Time: {elapsed}</span>
      </div>
    </div>
  );
}

function PredictiveMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-700/20 text-center">
      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xl font-display font-bold" style={{ color }}>{value}</p>
    </div>
  );
}
