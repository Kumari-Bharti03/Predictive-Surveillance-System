import { useState } from 'react';
import { Video, Wifi, WifiOff, AlertTriangle, User, Move, Maximize2, Circle, Camera } from 'lucide-react';
import { Card, Badge } from '@/components/ui/Card';
import { cameras, zones } from '@/lib/data';

export function CCTV() {
  const [selectedZone, setSelectedZone] = useState<string | 'all'>('all');
  const [gridSize, setGridSize] = useState<2 | 3 | 4>(3);

  const filteredCameras = selectedZone === 'all'
    ? cameras
    : cameras.filter((c) => c.zone === selectedZone);

  const onlineCount = cameras.filter((c) => c.status === 'online').length;
  const offlineCount = cameras.filter((c) => c.status === 'offline').length;
  const degradedCount = cameras.filter((c) => c.status === 'degraded').length;
  const totalDetections = cameras.reduce((sum, c) => sum + c.detections, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <CCTVStatCard label="Online Cameras" value={`${onlineCount}/${cameras.length}`} icon={<Wifi className="w-5 h-5" />} color="#00ff9d" />
        <CCTVStatCard label="Offline" value={offlineCount} icon={<WifiOff className="w-5 h-5" />} color="#ff3b3b" />
        <CCTVStatCard label="Degraded" value={degradedCount} icon={<AlertTriangle className="w-5 h-5" />} color="#ffcc00" />
        <CCTVStatCard label="Total Detections" value={totalDetections} icon={<User className="w-5 h-5" />} color="#00e5ff" />
      </div>

      <Card
        title="Camera Grid"
        icon={<Video className="w-4 h-4" />}
        action={
          <div className="flex items-center gap-3">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-slate-800/40 text-xs text-slate-300 rounded-lg px-3 py-1.5 border border-slate-700/30 outline-none cursor-pointer"
            >
              <option value="all">All Zones</option>
              {zones.map((z) => (
                <option key={z.id} value={z.name}>{z.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-1 bg-slate-800/40 rounded-lg p-1 border border-slate-700/30">
              {[2, 3, 4].map((size) => (
                <button
                  key={size}
                  onClick={() => setGridSize(size as 2 | 3 | 4)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all ${
                    gridSize === size
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          </div>
        }
      >
        <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
          {filteredCameras.slice(0, gridSize * gridSize).map((cam) => (
            <CameraFeed key={cam.id} camera={cam} />
          ))}
        </div>
      </Card>

      <Card title="Camera Health Status" icon={<Camera className="w-4 h-4" />}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Camera</th>
                <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Zone</th>
                <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Detections</th>
                <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Motion</th>
                <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Person</th>
                <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Recording</th>
              </tr>
            </thead>
            <tbody>
              {cameras.map((cam) => {
                const statusColor = cam.status === 'online' ? '#00ff9d' : cam.status === 'degraded' ? '#ffcc00' : '#ff3b3b';
                return (
                  <tr key={cam.id} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-cyan-400" />
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{cam.name}</p>
                          <p className="text-[10px] font-mono text-slate-500">{cam.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-400">{cam.zone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {cam.status === 'online' ? <Wifi className="w-3.5 h-3.5 text-green-400" /> : cam.status === 'degraded' ? <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" /> : <WifiOff className="w-3.5 h-3.5 text-red-400" />}
                        <span className="text-xs font-semibold capitalize" style={{ color: statusColor }}>{cam.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono font-semibold text-slate-300">{cam.detections}</span>
                    </td>
                    <td className="py-3 px-4">
                      {cam.motion ? (
                        <span className="flex items-center gap-1 text-xs text-yellow-400">
                          <Move className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {cam.personDetected ? (
                        <span className="flex items-center gap-1 text-xs text-red-400">
                          <User className="w-3.5 h-3.5" /> Detected
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {cam.recording ? (
                        <span className="flex items-center gap-1 text-xs text-red-400">
                          <Circle className="w-3 h-3 fill-red-500 pulse-dot" /> REC
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">Off</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function CameraFeed({ camera }: { camera: typeof cameras[0] }) {
  const statusColor = camera.status === 'online' ? '#00ff9d' : camera.status === 'degraded' ? '#ffcc00' : '#ff3b3b';

  return (
    <div
      className="relative rounded-lg overflow-hidden border bg-slate-950 group transition-all"
      style={{ borderColor: `${statusColor}22`, aspectRatio: '16/10' }}
    >
      {camera.status === 'offline' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950">
          <WifiOff className="w-8 h-8 text-red-500/50 mb-2" />
          <p className="text-xs font-mono text-red-400">SIGNAL LOST</p>
          <p className="text-[10px] font-mono text-slate-600">{camera.id}</p>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 grid-bg" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-950/60 to-slate-900/40" />

          {camera.personDetected && (
            <div className="absolute top-[30%] left-[40%] w-16 h-20 border-2 border-red-500 rounded-sm animate-pulse" style={{ boxShadow: '0 0 8px rgba(255,59,59,0.5)' }}>
              <span className="absolute -top-5 left-0 text-[9px] font-mono font-bold text-red-400 whitespace-nowrap">
                PERSON 94%
              </span>
            </div>
          )}

          {camera.motion && (
            <div className="absolute bottom-[20%] right-[20%]">
              <div className="w-10 h-10 border border-yellow-500/50 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            </div>
          )}

          <div className="absolute inset-0 scan-line" />

          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: statusColor }} />
              <span className="text-[10px] font-mono font-semibold text-slate-300">{camera.id}</span>
            </div>
            {camera.recording && (
              <div className="flex items-center gap-1">
                <Circle className="w-2 h-2 fill-red-500 text-red-500 pulse-dot" />
                <span className="text-[9px] font-mono text-red-400">REC</span>
              </div>
            )}
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">{camera.name}</p>
              <p className="text-[9px] font-mono text-slate-500">{camera.zone}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {camera.personDetected && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/30">
                  <User className="w-2.5 h-2.5 text-red-400" />
                  <span className="text-[8px] font-mono text-red-400">{camera.detections}</span>
                </span>
              )}
              {camera.motion && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/30">
                  <Move className="w-2.5 h-2.5 text-yellow-400" />
                </span>
              )}
              <button className="p-1 rounded bg-slate-800/60 hover:bg-slate-700/60 transition-colors">
                <Maximize2 className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CCTVStatCard({ label, value, icon, color, pulse }: { label: string; value: string | number; icon: React.ReactNode; color: string; pulse?: boolean }) {
  return (
    <div className="glass-card p-5 animate-slide-up" style={{ boxShadow: `0 0 16px ${color}15` }}>
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center ${pulse ? 'animate-blink' : ''}`}
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
