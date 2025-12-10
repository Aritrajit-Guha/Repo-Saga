'use client';

import { useEffect, useState, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { Shield, Cpu, Activity, Lock, Database, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const loadingSteps = [
  "ESTABLISHING SOUL LINK...",
  "DECRYPTING SOURCE CODE...",
  "MEASURING MANA CAPACITY...",
  "SUMMONING SHADOW ARMY...",
  "MATERIALIZING DUNGEON...",
  "SYSTEM AWAKENING COMPLETE."
];

// --- SUB-COMPONENT: Scramble Text Effect (Matrix style decoding) ---
const ScrambleText = ({ text, className }: { text: string; className?: string }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 2; // Speed of decoding
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{display}</span>;
};

export function SagaLoading({ repoUrl }: { repoUrl: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Step Cycler
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2500); // Slower, more dramatic steps

    // Progress & Log Generator
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        if (Math.random() > 0.6) {
             const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0');
             setLogs(prev => [`> PACKET_0x${randomHex.toUpperCase()}... DECRYPTED`, ...prev].slice(0, 10));
        }
        return prev + 0.8; // Slower progress for cinematic feel
      });
    }, 50);

    return () => { clearInterval(stepInterval); clearInterval(progressInterval); };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black text-blue-100 font-mono select-none">
      
      {/* --- LAYER 1: THE ENTITY (Background) --- */}
      <div className="absolute inset-0 z-0">
         <img 
            src="/assets/bg-loading.jpg" 
            className="w-full h-full object-cover opacity-50 scale-110 animate-pulse-slow"
            alt="Loading Entity"
         />
         {/* Hex Grid Overlay (Holographic Field) */}
         <div className="absolute inset-0 opacity-20" 
              style={{
                  backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)', 
                  backgroundSize: '30px 30px'
              }}>
         </div>
         {/* Vignette */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,black_90%)]"></div>
         
         {/* The Scanline Laser */}
         <div className="absolute inset-0 w-full h-[2px] bg-primary/50 shadow-[0_0_20px_#06b6d4] animate-scan opacity-50"></div>
      </div>

      {/* --- LAYER 2: THE TARGETING SYSTEM (Center) --- */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
         {/* Main Reticle */}
         <div className="w-[600px] h-[600px] rounded-full border border-primary/20 border-t-primary border-l-primary animate-[spin_12s_linear_infinite]"></div>
         <div className="absolute w-[550px] h-[550px] rounded-full border border-dashed border-primary/10 animate-[spin_20s_linear_infinite_reverse]"></div>
         
         {/* Warning Brackets */}
         <div className="absolute w-[300px] h-[300px] flex justify-between items-center opacity-80 animate-pulse">
            <div className="h-10 w-10 border-l-4 border-t-4 border-destructive rounded-tl-xl"></div>
            <div className="h-10 w-10 border-r-4 border-t-4 border-destructive rounded-tr-xl"></div>
         </div>
         <div className="absolute w-[300px] h-[300px] flex justify-between items-end opacity-80 animate-pulse">
            <div className="h-10 w-10 border-l-4 border-b-4 border-destructive rounded-bl-xl"></div>
            <div className="h-10 w-10 border-r-4 border-b-4 border-destructive rounded-br-xl"></div>
         </div>

         {/* Center Text "ANALYZING" */}
         <div className="absolute mt-32 bg-black/60 backdrop-blur-md px-4 py-1 rounded text-destructive text-[10px] tracking-[0.5em] border border-destructive/30">
            WARNING: HIGH MANA DENSITY
         </div>
      </div>

      {/* --- LAYER 3: HUD LEFT (Logs) --- */}
      <div className="absolute left-6 top-1/4 bottom-1/4 w-72 hidden lg:flex flex-col z-20">
         <div className="flex-1 bg-gradient-to-r from-black/80 to-transparent border-l-2 border-primary/40 p-6 flex flex-col backdrop-blur-sm mask-image-gradient-b">
            <h3 className="text-xs font-bold text-primary mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 animate-pulse" /> LIVE EXTRACTION
            </h3>
            <div className="flex-1 overflow-hidden flex flex-col justify-end gap-1">
                {logs.map((log, i) => (
                    <p key={i} className="text-[10px] text-primary/80 font-mono border-l border-primary/20 pl-2">
                        {log}
                    </p>
                ))}
            </div>
         </div>
      </div>

      {/* --- LAYER 4: HUD RIGHT (Stats) --- */}
      <div className="absolute right-6 top-1/3 w-64 hidden lg:flex flex-col gap-6 z-20 text-right">
         {/* Metric 1 */}
         <div>
            <h4 className="text-[10px] text-primary/60 tracking-widest mb-1">INTEGRITY</h4>
            <div className="text-4xl font-black text-white glow-blue flex justify-end items-end gap-2">
                <ScrambleText text={progress.toFixed(1)} /> <span className="text-sm mb-2">%</span>
            </div>
            <div className="w-full bg-primary/10 h-1 mt-1">
                <div className="h-full bg-primary" style={{width: `${progress}%`}}></div>
            </div>
         </div>

         {/* Metric 2 */}
         <div>
             <h4 className="text-[10px] text-accent/60 tracking-widest mb-1">THREAT LEVEL</h4>
             <div className="text-2xl font-bold text-accent flex justify-end items-center gap-2">
                 <AlertTriangle className="w-4 h-4" /> S-RANK
             </div>
         </div>

         {/* Metric 3 */}
         <div className="border-r-2 border-primary/40 pr-4 py-2 bg-gradient-to-l from-primary/10 to-transparent">
             <h4 className="text-[10px] text-white/60 tracking-widest">TARGET REPOSITORY</h4>
             <p className="text-xs text-primary truncate mt-1">{repoUrl}</p>
         </div>
      </div>

      {/* --- LAYER 5: BOTTOM STATUS (Main) --- */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex flex-col items-center">
         {/* Status Text with Scramble Effect */}
         <div className="bg-black/80 border border-primary/30 px-10 py-4 rounded-full backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.3)]">
             <p className="text-sm md:text-lg tracking-[0.2em] text-white font-bold text-center w-[300px] md:w-[500px]">
                <ScrambleText text={loadingSteps[currentStep]} />
             </p>
         </div>
         
         <div className="flex gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        i < (progress / 20) ? "bg-primary shadow-[0_0_10px_#06b6d4]" : "bg-primary/20"
                    )}
                />
            ))}
         </div>
      </div>

    </div>
  );
}