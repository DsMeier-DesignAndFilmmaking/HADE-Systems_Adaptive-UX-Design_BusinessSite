import React from 'react';
import { ShieldCheck, Zap, Maximize, Layers, Unlock, Activity, Compass } from 'lucide-react';
import Reveal from "@/src/components/hade/animation/Reveal";

const PhilosophyLayer = () => {
  const principles = [
    { 
      label: "Adaptation", 
      text: "The software follows the person, not the other way around.", 
      icon: <Zap size={14} className="text-cyberLime" strokeWidth={2.5} /> 
    },
    { 
      label: "Utility", 
      text: "Helping the system work with people.", 
      icon: <ShieldCheck size={14} className="text-cyberLime" strokeWidth={2.5} /> 
    },
    { 
      label: "Depth", 
      text: "Understand the 'why' behind every click.", 
      icon: <Maximize size={14} className="text-cyberLime" strokeWidth={2.5} /> 
    },
    { 
      label: "Scale", 
      text: "Build for the journey, not just the screen.", 
      icon: <Layers size={14} className="text-cyberLime" strokeWidth={2.5} /> 
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        
        <Reveal delay={100}>
          <div className="relative w-full rounded-[40px] bg-[#0A0A0B] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.25)] overflow-hidden">
            
            <div className="grid lg:grid-cols-[1fr_1.1fr] items-stretch">
              
              {/* Left Column: The Narrative (Philosophy) */}
              <div className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col relative overflow-hidden">
                
                <div className="relative z-10 mb-12">
                  <div className="flex items-center gap-3 mb-8">
                    <Compass size={16} className="text-cyberLime/80" strokeWidth={1.5} />
                    <p className="font-mono text-[9px] uppercase tracking-[.4em] text-white/40 font-bold">
                      Foundation // Volume 01   
                    </p>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6">
                    Philosophy
                  </h2>
                  <p className="text-xl md:text-2xl font-medium text-white/90 italic tracking-tight leading-snug">
                    "Design that actually listens."
                  </p>
                  <p className="mt-6 text-base text-white/50 leading-relaxed max-w-sm">
                    Most software forces everyone down the same path. We believe technology should observe how you move and adjust itself to meet you where you are.
                  </p>
                </div>

                {/* THE TOPOLOGY GRAPHIC: Mapping the Shift */}
                <div className="relative w-full h-32 mt-auto opacity-40">
                  <svg viewBox="0 0 400 120" className="w-full h-full text-white/20">
                    <line x1="0" y1="60" x2="400" y2="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
                    <path 
                      d="M 20 60 Q 100 60, 150 40 T 280 80 T 380 60" 
                      fill="none" 
                      stroke="url(#gradient-lime)" 
                      strokeWidth="1.5" 
                    />
                    {[40, 150, 280, 350].map((x, i) => (
                      <circle key={i} cx={x} cy={60} r="1.5" fill="currentColor" />
                    ))}
                    <text x="20" y="100" className="fill-white/20 font-mono text-[8px] tracking-[.2em] uppercase">Human Pace</text>
                    <text x="320" y="20" className="fill-cyberLime font-mono text-[8px] tracking-[.2em] uppercase font-bold">The Adjustment</text>

                    <defs>
                      <linearGradient id="gradient-lime" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                        <stop offset="50%" stopColor="#A3E635" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="mt-12 flex items-center gap-6 relative z-10">
                  <div className="h-px flex-1 bg-white/5" />
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyberLime" />
                    <span className="font-mono text-[8px] uppercase tracking-[.3em] text-white/30 font-bold">Living System</span>
                  </div>
                </div>
              </div>

              {/* Right Column: The Field Notes (Principles) */}
              <div className="bg-[#0D0D0E] p-10 md:p-14">
                <div className="flex items-center gap-2 mb-10">
                  <Activity size={12} className="text-white/20" />
                  <p className="font-mono text-[9px] uppercase tracking-[.4em] text-white/20 font-bold">How we see the world</p>
                </div>

                <div className="grid gap-px bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                  {principles.map((p, i) => (
                    <div 
                      key={p.label} 
                      className="group flex items-start gap-6 p-7 bg-[#0A0A0B] hover:bg-[#111112] transition-all duration-500"
                    >
                      <div className="mt-1 flex flex-col items-center">
                        <p className="font-mono text-[8px] text-white/20 mb-2">0{i+1}</p>
                        <div className="p-2 rounded-full border border-white/5 group-hover:border-cyberLime/30 transition-colors">
                          {p.icon}
                        </div>
                      </div>
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[.3em] text-cyberLime/50 font-bold mb-2">{p.label}</p>
                        <p className="text-base font-medium text-white/80 group-hover:text-white transition-colors leading-snug">
                          {p.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex justify-between items-end">
                  <p className="text-[10px] font-mono text-white/10 leading-relaxed italic max-w-[240px]">
                    // Mapping the space between intention and action.
                  </p>
                  <Unlock size={14} className="text-white/5" />
                </div>
              </div>

            </div>
          </div>
        </Reveal>

        {/* NatGeo Signature Footer */}
        <Reveal delay={300}>
          <div className="mt-10 flex justify-center">
            <div className="px-6 py-2 border-l border-r border-ink/5">
               <p className="font-mono text-[10px] uppercase tracking-[.6em] text-ink/20">
                 HADE Systems · 2026
               </p>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
};

export default PhilosophyLayer;