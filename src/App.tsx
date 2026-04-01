/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Box, 
  Cpu, 
  Database, 
  Eye, 
  Layers, 
  Play, 
  Settings, 
  Shield, 
  TrendingUp, 
  Users,
  ChevronRight,
  Terminal,
  FileText,
  Github,
  Monitor
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from './lib/utils';

// Mock data for the charts
const trackingData = Array.from({ length: 20 }, (_, i) => ({
  frame: i,
  players: 10 + Math.floor(Math.random() * 5),
  confidence: 0.85 + Math.random() * 0.12,
  latency: 15 + Math.random() * 10
}));

const stats = [
  { label: 'Active Tracks', value: '22', icon: Users, color: 'text-green-400' },
  { label: 'Avg Confidence', value: '94.2%', icon: Shield, color: 'text-blue-400' },
  { label: 'Inference Time', value: '18ms', icon: Cpu, color: 'text-purple-400' },
  { label: 'Total Detections', value: '1,402', icon: Activity, color: 'text-orange-400' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'architecture'>('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleProcessing = () => setIsProcessing(!isProcessing);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-green-500/30">
      {/* Navigation Rail */}
      <nav className="fixed left-0 top-0 h-full w-16 border-r border-white/10 bg-black/50 backdrop-blur-xl z-50 flex flex-col items-center py-8 gap-8">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)]">
          <Activity className="text-black w-6 h-6" />
        </div>
        
        <div className="flex flex-col gap-6 mt-12">
          <NavIcon icon={Monitor} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="Dashboard" />
          <NavIcon icon={Layers} active={activeTab === 'architecture'} onClick={() => setActiveTab('architecture')} label="Architecture" />
          <NavIcon icon={FileText} active={activeTab === 'report'} onClick={() => setActiveTab('report')} label="Report" />
        </div>

        <div className="mt-auto flex flex-col gap-6 pb-4">
          <NavIcon icon={Settings} active={false} onClick={() => {}} label="Settings" />
          <NavIcon icon={Github} active={false} onClick={() => {}} label="Source" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-16 min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 sticky top-0 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <h1 className="font-mono text-sm font-bold tracking-widest uppercase text-zinc-400">
              System: <span className="text-green-500">SportsTrack_v8.0</span>
            </h1>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/10">
              <Terminal className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tighter">GPU: NVIDIA RTX 4090</span>
            </div>
            <button 
              onClick={toggleProcessing}
              className={cn(
                "px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-all",
                isProcessing 
                  ? "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30" 
                  : "bg-green-500 text-black hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              )}
            >
              {isProcessing ? 'Stop Engine' : 'Start Engine'}
            </button>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardView isProcessing={isProcessing} />}
            {activeTab === 'architecture' && <ArchitectureView />}
            {activeTab === 'report' && <ReportView />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavIcon({ icon: Icon, active, onClick, label }: { icon: any, active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative group p-3 rounded-xl transition-all duration-300",
        active ? "bg-white/10 text-green-500" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="absolute left-16 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest border border-white/10">
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="active-pill"
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-green-500 rounded-r-full"
        />
      )}
    </button>
  );
}

function DashboardView({ isProcessing }: { isProcessing: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-12 gap-6"
    >
      {/* Stats Grid */}
      {stats.map((stat, i) => (
        <div key={i} className="col-span-3 glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-mono font-bold mb-1">{stat.value}</div>
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">{stat.label}</div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: isProcessing ? '100%' : '30%' }}
              className={cn("h-full", stat.color.replace('text-', 'bg-'))}
            />
          </div>
        </div>
      ))}

      {/* Video Feed */}
      <div className="col-span-8 glass rounded-3xl overflow-hidden relative aspect-video group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        
        {/* Mock Video Content */}
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/sports/1280/720')] bg-cover bg-center">
          {isProcessing && (
            <>
              <div className="scanline" />
              {/* Simulated Bounding Boxes */}
              <motion.div 
                animate={{ x: [100, 150, 120], y: [100, 120, 110] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute border-2 border-green-500 w-24 h-48 z-20"
              >
                <div className="absolute -top-6 left-0 bg-green-500 text-black text-[10px] font-bold px-1 uppercase">ID: 04 | Player</div>
              </motion.div>
              <motion.div 
                animate={{ x: [400, 380, 420], y: [200, 220, 210] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute border-2 border-blue-500 w-20 h-44 z-20"
              >
                <div className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] font-bold px-1 uppercase">ID: 12 | Player</div>
              </motion.div>
              <motion.div 
                animate={{ x: [600, 650, 620], y: [300, 320, 310] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute border-2 border-orange-500 w-16 h-16 z-20 rounded-full"
              >
                <div className="absolute -top-6 left-0 bg-orange-500 text-white text-[10px] font-bold px-1 uppercase">ID: 01 | Ball</div>
              </motion.div>
            </>
          )}
        </div>

        {/* HUD Overlay */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
            <div className={cn("w-2 h-2 rounded-full", isProcessing ? "bg-red-500 animate-pulse" : "bg-zinc-500")} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
              {isProcessing ? 'Live Feed :: Processing' : 'Feed :: Standby'}
            </span>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <div className="text-xs font-mono text-zinc-400">CAM_01 // STADIUM_NORTH</div>
            <div className="text-2xl font-bold tracking-tighter">PREMIER_LEAGUE_MATCH_DAY_12</div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
              <Box className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Sidebar */}
      <div className="col-span-4 flex flex-col gap-6">
        <div className="glass p-6 rounded-3xl flex-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Confidence Flow</h3>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trackingData}>
                <defs>
                  <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="confidence" stroke="#22c55e" fillOpacity={1} fill="url(#colorConf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-[10px] text-zinc-500 uppercase mb-1">Max Conf</div>
              <div className="font-mono font-bold text-green-400">99.8%</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-[10px] text-zinc-500 uppercase mb-1">Min Conf</div>
              <div className="font-mono font-bold text-yellow-400">82.1%</div>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">System Logs</h3>
          <div className="space-y-3 font-mono text-[10px]">
            <LogItem time="12:40:01" msg="YOLOv8 Weights Loaded" status="success" />
            <LogItem time="12:40:02" msg="ByteTrack Initialized" status="success" />
            <LogItem time="12:40:05" msg="Buffer Overflow Detected" status="warning" />
            <LogItem time="12:40:06" msg="Re-identifying Track ID 12" status="info" />
            <LogItem time="12:40:08" msg="Processing Frame 1402" status="info" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LogItem({ time, msg, status }: { time: string, msg: string, status: 'success' | 'warning' | 'info' }) {
  const colors = {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };
  return (
    <div className="flex gap-3 border-b border-white/5 pb-2">
      <span className="text-zinc-600">{time}</span>
      <span className={cn("font-bold", colors[status])}>[{status.toUpperCase()}]</span>
      <span className="text-zinc-400 truncate">{msg}</span>
    </div>
  );
}

function ArchitectureView() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-4xl mx-auto py-12"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tighter mb-4">Pipeline Architecture</h2>
        <p className="text-zinc-400">The end-to-end flow of our multi-object tracking system.</p>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-500 via-white/10 to-transparent -translate-x-1/2" />
        
        <div className="space-y-24 relative">
          <ArchStep 
            icon={Play} 
            title="Input Video" 
            desc="Raw video stream from stadium cameras (1080p/4K @ 60fps)." 
            side="left"
          />
          <ArchStep 
            icon={Box} 
            title="YOLOv8 Detection" 
            desc="Deep learning model identifies people, balls, and equipment in each frame." 
            side="right"
          />
          <ArchStep 
            icon={Database} 
            title="Feature Extraction" 
            desc="Extracting visual features and motion vectors for tracking consistency." 
            side="left"
          />
          <ArchStep 
            icon={Shield} 
            title="ByteTrack / DeepSORT" 
            desc="Assigning unique IDs and maintaining them across occlusions." 
            side="right"
          />
          <ArchStep 
            icon={Monitor} 
            title="Visualization" 
            desc="Rendering bounding boxes, IDs, and trajectory lines on the output." 
            side="left"
          />
        </div>
      </div>
    </motion.div>
  );
}

function ArchStep({ icon: Icon, title, desc, side }: { icon: any, title: string, desc: string, side: 'left' | 'right' }) {
  return (
    <div className={cn("flex items-center gap-12", side === 'right' ? 'flex-row-reverse' : '')}>
      <div className="flex-1 text-right">
        {side === 'left' && (
          <div className="glass p-6 rounded-2xl border-l-4 border-green-500">
            <h4 className="font-bold mb-2">{title}</h4>
            <p className="text-sm text-zinc-400">{desc}</p>
          </div>
        )}
      </div>
      <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-green-500 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
        <Icon className="w-5 h-5 text-green-500" />
      </div>
      <div className="flex-1">
        {side === 'right' && (
          <div className="glass p-6 rounded-2xl border-r-4 border-green-500">
            <h4 className="font-bold mb-2">{title}</h4>
            <p className="text-sm text-zinc-400">{desc}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto glass p-12 rounded-[3rem] border-white/5"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-green-500/10 rounded-2xl">
          <FileText className="text-green-500 w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Technical Report</h2>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Project ID: AIS-CV-2026</p>
        </div>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-zinc-300">
        <section>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-green-500" />
            1. Model Selection: YOLOv8
          </h3>
          <p className="leading-relaxed">
            We utilized <strong>YOLOv8 (You Only Look Once)</strong> from Ultralytics for the detection phase. 
            The nano version (yolov8n.pt) was chosen for its exceptional balance between speed and accuracy, 
            achieving over 60 FPS on standard hardware while maintaining high mAP (mean Average Precision) 
            on the COCO dataset.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-green-500" />
            2. Tracking Algorithm: ByteTrack
          </h3>
          <p className="leading-relaxed">
            For multi-object tracking (MOT), we implemented <strong>ByteTrack</strong>. Unlike traditional 
            trackers that discard low-confidence detections, ByteTrack associates almost every detection 
            box by leveraging the similarities with previous tracks. This significantly reduces ID switches 
            during heavy occlusion—a common challenge in sports analytics.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-green-500" />
            3. Challenges & Solutions
          </h3>
          <ul className="space-y-4 list-none pl-0">
            <li className="flex gap-3">
              <span className="text-green-500 font-bold">01.</span>
              <span><strong>Occlusion:</strong> Solved by ByteTrack's low-confidence matching strategy.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500 font-bold">02.</span>
              <span><strong>Motion Blur:</strong> Addressed by using a high-shutter speed dataset for fine-tuning.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500 font-bold">03.</span>
              <span><strong>ID Consistency:</strong> Enhanced by incorporating Kalman Filters for motion prediction.</span>
            </li>
          </ul>
        </section>

        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 mt-12">
          <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Conclusion</h4>
          <p className="text-sm italic">
            "The combination of YOLOv8 and ByteTrack provides a production-ready pipeline for real-time 
            sports analytics, capable of handling dynamic environments with minimal latency."
          </p>
        </div>
      </div>
    </motion.div>
  );
}
