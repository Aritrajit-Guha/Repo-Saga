// src/app/page.tsx
import { RepoForm } from '@/components/repo-form';
import { Badge } from '@/components/ui/badge';
import { Sword, Skull, Crown } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-14 relative overflow-hidden">
      
      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <img 
          src="/assets/bg-landing.jpg"
          alt="Battle Background"
          className="w-full h-full object-cover animate-ken-burns opacity-75 brightness-70"
        />
        {/* Smooth vignette for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"></div>
      </div>

      {/* --- HERO CONTENT --- */}
      <div className="space-y-7 max-w-4xl z-10 animate-in fade-in zoom-in duration-1000">

        {/* Badge */}
        <Badge
          variant="outline"
          className="border-white/30 text-white px-4 py-1.5 text-sm tracking-[0.25em] uppercase bg-black/40 backdrop-blur-sm shadow-[0_0_12px_rgba(255,255,255,0.18)] rounded-md"
        >
          Embark on Repository's Quest
        </Badge>

        {/* Title */}
        <h1 className="pixelify text-6xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_6px_5px_rgba(0,0,0,0.85)] leading-tight">
          Awaken <span className="ml-8">Your</span> <br />
          
          <span
            className="nosifer text-[#f43434]"
            style={{
              textShadow:
                "0 0 6px rgba(178,34,34,0.5), 0 0 12px rgba(139,0,0,0.4), 0 4px 6px rgba(0,0,0,0.5)",
            }}
          >
            CodeBase
          </span>
        </h1>


        {/* Subheading */}
        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          The System invites you to transform complex repositories into a <br></br><span className="text-primary font-bold">~ Dungeon ~</span>
        </p>
      </div>

      {/* --- ACTION AREA (FORM) --- */}
      <div className="w-full max-w-xl relative group z-20">
        {/* Halo behind form */}
        <div
          className="absolute -inset-1 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500"
          style={{
            background:
              "linear-gradient(90deg, #b22222aa, #8b0000aa, #b22222aa)",
          }}
        />

        {/* Form box */}
        <div className="relative bg-black/70 backdrop-blur-xl p-5 rounded-xl border border-white/15 shadow-2xl">
          <RepoForm />
        </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/85 mt-20 w-full max-w-5xl px-4">

        <div className="flex flex-col items-center p-6 border border-white/10 bg-black/40 backdrop-blur-md rounded-xl hover:bg-black/55 hover:scale-105 transition-all duration-300 shadow-lg">
          <Sword className="mb-3 text-primary w-10 h-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          <span className="font-bold text-lg text-white">Codebase Cartography</span>
        </div>

        <div className="flex flex-col items-center p-6 border border-white/10 bg-black/40 backdrop-blur-md rounded-xl hover:bg-black/55 hover:scale-105 transition-all duration-300 shadow-lg">
          <Crown className="mb-3 text-accent w-10 h-10 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
          <span className="font-bold text-lg text-white">Quest Board</span>
        </div>

        <div className="flex flex-col items-center p-6 border border-white/10 bg-black/40 backdrop-blur-md rounded-xl hover:bg-black/55 hover:scale-105 transition-all duration-300 shadow-lg">
          <Skull className="mb-3 text-destructive w-10 h-10 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
          <span className="font-bold text-lg text-white">The "Roast" Arena</span>
        </div>

      </div>
    </div>
  );
}
