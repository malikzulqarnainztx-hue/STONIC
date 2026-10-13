import React, { useState, useEffect, useRef } from 'react';
import { Camera, Monitor, RefreshCw, Pin, Sliders, Maximize2, X, Search as SearchIcon, Globe, AlertTriangle, Info } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface LeftFeedColumnProps {
  onSelectHeadline?: (text: string) => void;
}

export const LeftFeedColumn: React.FC<LeftFeedColumnProps> = ({ onSelectHeadline }) => {
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
  const [activeGlobeTab, setActiveGlobeTab] = useState<'Today' | 'Map' | 'Search' | 'Alerts' | 'More'>('Today');
  const [cameraActive, setCameraActive] = useState(false);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [selectedPinInfo, setSelectedPinInfo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshingHeadlines, setIsRefreshingHeadlines] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const globeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Toggle real webcam stream
  const toggleCamera = async () => {
    sound.playClick();
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setScreenShareActive(false);
      } catch (_) {
        // Simulated stream if user denies or in iframe
        setCameraActive(true);
      }
    }
  };

  // Toggle real screen share
  const toggleScreen = async () => {
    sound.playClick();
    if (screenShareActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setScreenShareActive(false);
    } else {
      try {
        if (navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setScreenShareActive(true);
          setCameraActive(false);
        } else {
          setScreenShareActive(true);
        }
      } catch (_) {
        setScreenShareActive(true);
      }
    }
  };

  // Globe Render: 3D Sphere or 2D Mercator Grid
  useEffect(() => {
    const canvas = globeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0;

    const geoPins = [
      { name: 'Redmond AI Lab', lat: 47.67, lon: -122.12, color: '#00ff88', type: 'diamond' },
      { name: 'San Francisco Hub', lat: 37.77, lon: -122.41, color: '#00ff88', type: 'diamond' },
      { name: 'Geneva CERN Intel', lat: 46.2, lon: 6.14, color: '#f59e0b', type: 'diamond' },
      { name: 'London Node', lat: 51.5, lon: -0.12, color: '#f59e0b', type: 'circle' },
      { name: 'Islamabad Core', lat: 33.68, lon: 73.04, color: '#ef4444', type: 'ring' },
      { name: 'Tokyo Quantum Lab', lat: 35.68, lon: 139.69, color: '#ef4444', type: 'ring' },
      { name: 'Atacama Array', lat: -23.86, lon: -68.25, color: '#38bdf8', type: 'diamond' },
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 3;
      const radius = 62;

      rotation += 0.007;

      if (viewMode === '3D') {
        // 3D Sphere gradient
        const sphereGrad = ctx.createRadialGradient(cx - 20, cy - 20, 8, cx, cy, radius);
        sphereGrad.addColorStop(0, '#2e1e18');
        sphereGrad.addColorStop(0.5, '#16100d');
        sphereGrad.addColorStop(1, '#060403');

        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Rim Glow
        ctx.strokeStyle = 'rgba(255, 40, 70, 0.45)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Continents (moving clusters)
        ctx.fillStyle = 'rgba(75, 90, 110, 0.3)';
        for (let i = 0; i < 4; i++) {
          const off = ((rotation * 55 + i * 90) % 360) * (Math.PI / 180);
          const lx = cx + Math.sin(off) * 44;
          const ly = cy + Math.cos(off) * 18;
          ctx.beginPath();
          ctx.arc(lx, ly, 16, 0, Math.PI * 2);
          ctx.fill();
        }

        // Latitude Rings
        [-25, 0, 25].forEach((lat) => {
          const y = cy + Math.sin((lat * Math.PI) / 180) * radius * 0.7;
          const rx = Math.cos((lat * Math.PI) / 180) * radius;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.ellipse(cx, y, rx, rx * 0.22, 0, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Pins
        geoPins.forEach((pin) => {
          const radLon = ((pin.lon + rotation * 60) * Math.PI) / 180;
          const radLat = (pin.lat * Math.PI) / 180;
          const x = cx + Math.cos(radLat) * Math.sin(radLon) * radius;
          const y = cy - Math.sin(radLat) * radius * 0.88;
          const isFront = Math.cos(radLon) > -0.2;

          if (isFront) {
            ctx.fillStyle = pin.color;
            ctx.strokeStyle = pin.color;
            ctx.shadowColor = pin.color;
            ctx.shadowBlur = 6;

            if (pin.type === 'diamond') {
              ctx.beginPath();
              ctx.moveTo(x, y - 4);
              ctx.lineTo(x + 4, y);
              ctx.lineTo(x, y + 4);
              ctx.lineTo(x - 4, y);
              ctx.closePath();
              ctx.fill();
            } else if (pin.type === 'circle') {
              ctx.beginPath();
              ctx.arc(x, y, 3, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, Math.PI * 2);
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
            ctx.shadowBlur = 0;
          }
        });

        // White Pyramid marker at bottom matching screenshot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(cx, cy + radius + 1);
        ctx.lineTo(cx - 3, cy + radius + 6);
        ctx.lineTo(cx + 3, cy + radius + 6);
        ctx.closePath();
        ctx.fill();
      } else {
        // 2D Mercator Grid Mode
        ctx.fillStyle = '#100b0e';
        ctx.fillRect(cx - 85, cy - 55, 170, 110);
        ctx.strokeStyle = 'rgba(255, 40, 70, 0.3)';
        ctx.strokeRect(cx - 85, cy - 55, 170, 110);

        // Grid lines
        for (let x = cx - 85; x <= cx + 85; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, cy - 55);
          ctx.lineTo(x, cy + 55);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.stroke();
        }
        for (let y = cy - 55; y <= cy + 55; y += 22) {
          ctx.beginPath();
          ctx.moveTo(cx - 85, y);
          ctx.lineTo(cx + 85, y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.stroke();
        }

        // 2D Pins
        geoPins.forEach((pin, idx) => {
          const px = cx - 70 + (idx * 24);
          const py = cy - 30 + Math.sin(idx) * 25;
          ctx.fillStyle = pin.color;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [viewMode]);

  const [headlines, setHeadlines] = useState([
    'ACQUIRING NEURAL BROADCAST SIGNAL...',
    'CONNECTING TO CENTRAL TELEMETRY...',
    'RETRIEVING GEOGRAPHICAL DATA FEEDS...',
    'RESOLVING INTERCEPT CORRELATIONS...',
  ]);

  const refreshHeadlines = () => {
    sound.playClick();
    setIsRefreshingHeadlines(true);
    setTimeout(() => {
      setHeadlines([
        'MICROSOFT BITNET 1-BIT LLM RUNNING ON LOCAL CPU...',
        'SATELLITE DOWNLINK VERIFIED ACROSS 14 NODES...',
        'SECURITY PROTOCOL 0 ARMED AND READY...',
        'SYNCHRONIZING OPERATOR MEMORY VAULT WITH CORE...',
      ]);
      setIsRefreshingHeadlines(false);
      sound.playSuccess();
    }, 600);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between gap-2.5 select-none font-rajdhani">
      {/* 1. MEDIA LINK PANEL */}
      <div className="stonic-panel p-3 flex flex-col justify-between h-28 relative shadow-[0_0_20px_rgba(255,34,56,0.15)] overflow-hidden">
        <div className="flex items-center justify-between text-[11px] font-code text-[#ff3355] z-10">
          <span className="flex items-center gap-1.5 font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2238] animate-pulse" />
            MEDIA LINK
          </span>
          <button
            onClick={() => sound.playClick()}
            className="text-gray-500 hover:text-white cursor-pointer"
          >
            ...
          </button>
        </div>

        {/* Video stream container when active, or offline badge */}
        <div className="relative flex items-center justify-center my-auto z-10 w-full h-12">
          {cameraActive || screenShareActive ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-emerald-500/50 flex items-center justify-center bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute top-1 left-2 text-[9px] font-code text-emerald-400 font-bold bg-black/60 px-1 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{cameraActive ? 'WEBCAM LINK' : 'SCREEN FEED'}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={toggleCamera}
              className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-code text-gray-400 font-semibold tracking-wider hover:text-white hover:border-white/30 transition-all cursor-pointer"
            >
              SYSTEM OFFLINE
            </button>
          )}
        </div>

        {/* Bottom Right Controls (Camera / Monitor) */}
        <div className="flex justify-end gap-1.5 z-10">
          <button
            onClick={toggleCamera}
            title={cameraActive ? 'Disconnect Camera' : 'Connect Camera'}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              cameraActive ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-black/50 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleScreen}
            title={screenShareActive ? 'Stop Screen Share' : 'Start Screen Share'}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              screenShareActive ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-black/50 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. SAT-LINK FEED PANEL */}
      <div className="stonic-panel p-3 flex flex-col justify-between flex-1 relative shadow-[0_0_20px_rgba(255,34,56,0.15)]">
        <div className="flex items-center justify-between text-[11px] font-code text-[#ff3355] pb-1.5 border-b border-white/5">
          <span className="flex items-center gap-1.5 font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2238]" />
            SAT-LINK FEED
          </span>
        </div>

        {/* Subheader: SATELLITE STREAM with 2D/3D switcher */}
        <div className="flex items-center justify-between text-[10px] font-code text-gray-400 my-1">
          <span className="flex items-center gap-1.5 text-gray-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            SATELLITE STREAM
          </span>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center p-0.5 rounded-md bg-black/60 border border-white/10">
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('2D');
                }}
                className={`px-2 py-0.5 rounded text-[9px] cursor-pointer transition-colors ${viewMode === '2D' ? 'bg-[#00ff88] text-black font-bold' : 'text-gray-400'}`}
              >
                2D
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('3D');
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-colors ${viewMode === '3D' ? 'bg-[#00ff88] text-black shadow-[0_0_8px_rgba(0,255,136,0.6)]' : 'text-gray-400'}`}
              >
                3D
              </button>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setIsMaximized(true);
              }}
              title="Expand Full Sat-Link Telemetry Map"
              className="text-gray-400 hover:text-white cursor-pointer p-0.5 rounded hover:bg-white/10"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Dynamic Center Viewport: Rotating 3D Globe matching screenshot */}
        {(activeGlobeTab === 'Today' || activeGlobeTab === 'Map' || activeGlobeTab === 'Search') && (
          <div className="relative w-full h-44 flex flex-col justify-center my-auto">
            {activeGlobeTab === 'Search' && (
              <div className="flex items-center gap-1 p-1 bg-black/70 rounded-lg border border-white/10 text-xs mb-1">
                <SearchIcon className="w-3 h-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter station or city..."
                  className="w-full bg-transparent text-[10px] text-white focus:outline-none"
                />
              </div>
            )}
            <div className="relative w-full h-40 flex items-center justify-center">
              <canvas
                ref={globeCanvasRef}
                width={200}
                height={160}
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => {
                  sound.playClick();
                  setSelectedPinInfo('Sat-Link Target Locked: Islamabad Node (33.68° N, 73.04° E) · Signal 99.8%');
                }}
              />
              <div className="absolute bottom-1 right-2 text-[8px] font-code text-gray-500/80 pointer-events-none">
                © OpenStreetMap © Natural Earth
              </div>
            </div>
          </div>
        )}

        {activeGlobeTab === 'Alerts' && (
          <div className="w-full h-44 overflow-y-auto space-y-1 my-auto p-1 text-[9px] font-code">
            <div className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300">
              <div className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                Solar Flare Level G1
              </div>
              <p className="text-gray-400 mt-0.5">HF communications minor degredation over high latitudes.</p>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
              <div className="font-bold">Geneva Downlink Nominal</div>
              <p className="text-gray-400 mt-0.5">High-speed quantum key exchange active.</p>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300">
              <div className="font-bold">Atacama Array Recalibration</div>
              <p className="text-gray-400 mt-0.5">Sub-millimeter dish azimuth rotation underway.</p>
            </div>
          </div>
        )}

        {activeGlobeTab === 'More' && (
          <div className="w-full h-44 overflow-y-auto p-1.5 text-[9px] font-code text-gray-300 space-y-1.5 my-auto">
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="text-gray-500">Ephemeris Epoch:</span>
              <span className="text-white">J2000.0</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="text-gray-500">Inclination:</span>
              <span className="text-white">51.64°</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="text-gray-500">Eccentricity:</span>
              <span className="text-white">0.00034</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="text-gray-500">Uplink Cipher:</span>
              <span className="text-emerald-400">Kyber-1024 PQ</span>
            </div>
          </div>
        )}

        {/* Popover info if pin selected */}
        {selectedPinInfo && (
          <div className="p-1.5 rounded-md bg-black/85 border border-[#ff2238]/60 text-[9px] font-code text-cyan-300 flex items-center justify-between mb-1">
            <span className="truncate">{selectedPinInfo}</span>
            <button onClick={() => setSelectedPinInfo(null)} className="text-gray-400 hover:text-white ml-1">✕</button>
          </div>
        )}

        {/* Bottom Navigation Pills: Today | Map | Search | Alerts | More */}
        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-white/5 text-[9px] font-code select-none">
          {(['Today', 'Map', 'Search', 'Alerts', 'More'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                sound.playClick();
                setActiveGlobeTab(tab);
              }}
              className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                activeGlobeTab === tab
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3. TODAY HEADLINES PANEL */}
      <div className="stonic-panel p-3 flex flex-col justify-between h-36 relative shadow-[0_0_20px_rgba(255,34,56,0.15)]">
        <div className="flex items-center justify-between text-[11px] font-code text-[#ff3355] pb-1.5 border-b border-white/5">
          <span className="flex items-center gap-1.5 font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2238]" />
            TODAY HEADLINES
          </span>
          <div className="flex items-center gap-2 text-gray-500">
            <button
              onClick={refreshHeadlines}
              title="Refresh signal feed"
              className="hover:text-white cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingHeadlines ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => sound.playClick()} className="hover:text-white cursor-pointer"><Pin className="w-3 h-3" /></button>
            <button onClick={() => sound.playClick()} className="hover:text-white cursor-pointer"><Sliders className="w-3 h-3" /></button>
          </div>
        </div>

        <div className="space-y-1.5 py-1 font-code text-[10px] text-gray-400">
          {headlines.map((line, idx) => (
            <div
              key={idx}
              onClick={() => onSelectHeadline && onSelectHeadline(line)}
              className="flex items-start gap-1.5 leading-snug cursor-pointer group hover:text-gray-200 transition-colors"
            >
              <span className="text-[#ff3355]">—</span>
              <span className="group-hover:text-cyan-300 transition-colors truncate">{line}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Sat-Link Modal */}
      {isMaximized && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-[#ff2238] bg-[#070103] p-5 shadow-[0_0_50px_rgba(255,34,56,0.35)] relative flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-orbitron font-bold text-sm tracking-widest text-white">
                  GLOBAL SAT-LINK TELEMETRY & TARGETING MESH
                </h3>
              </div>
              <button
                onClick={() => setIsMaximized(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-code">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-gray-500 block text-[10px]">GROUND STATION LOCK</span>
                <span className="text-emerald-400 font-bold text-sm">14 STATIONS SYNCED</span>
                <p className="text-[10px] text-gray-400">Continuous telemetry feed active over Ka-Band & Laser Interlink.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-gray-500 block text-[10px]">ACTIVE ORBITAL TRAJECTORY</span>
                <span className="text-cyan-400 font-bold text-sm">LEO 542 KM · 7.61 KM/S</span>
                <p className="text-[10px] text-gray-400">92.8 min orbital period with zero drag correction needed.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-gray-500 block text-[10px]">DOWNLINK THROUGHPUT</span>
                <span className="text-amber-400 font-bold text-sm">1,420 MBPS DUPLEX</span>
                <p className="text-[10px] text-gray-400">Kyber-1024 post-quantum encrypted telemetry bus.</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/60 p-4 space-y-2 text-xs font-code">
              <span className="text-gray-400 block font-bold text-[11px]">ACTIVE SATELLITE INTERCEPT NODES:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                {[
                  { name: 'Redmond AI Lab', coords: '47.67° N, -122.12° W', stat: 'ONLINE', col: 'text-emerald-400' },
                  { name: 'Islamabad Core', coords: '33.68° N, 73.04° E', stat: 'ONLINE', col: 'text-emerald-400' },
                  { name: 'Geneva CERN Intel', coords: '46.20° N, 6.14° E', stat: 'SYNCED', col: 'text-cyan-400' },
                  { name: 'Tokyo Quantum Lab', coords: '35.68° N, 139.69° E', stat: 'ACTIVE', col: 'text-amber-400' },
                ].map((n, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white font-bold block">{n.name}</span>
                    <span className="text-gray-400 block text-[9px]">{n.coords}</span>
                    <span className={`font-bold block mt-1 ${n.col}`}>● {n.stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
