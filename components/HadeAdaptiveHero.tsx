import { Activity, Layers, RefreshCw, Zap } from "lucide-react";
import Reveal from "@/src/components/hade/animation/Reveal";
import { type ReactNode } from "react";

const THEME = {
  fonts: {
    serif: "'tiempos-headline-regular', serif",
  },
};

type BusinessNodeProps = {
  level: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  delay: number;
  highlight?: boolean;
};

export function HadeAdaptiveHero() {
  return (
    <div className="relative flex w-full flex-col items-center py-12">
      <BusinessNode
        level="L1"
        title="Behavioral Mapping"
        subtitle="Live intent & signal telemetry"
        icon={<Activity className="h-4 w-4 text-slate-900" />}
        delay={0}
      />

      <Connector color="teal" />

      <Reveal delay={120} className="relative z-10 w-full max-w-sm group">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal-500/20 to-indigo-500/20 blur-lg opacity-40 transition duration-1000 group-hover:opacity-70" />
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-[#0d0d0e] p-6 shadow-2xl">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-teal-500">
                L2 • Adaptive Layer
              </p>
              <h4 className="mt-1 text-xl text-white" style={{ fontFamily: THEME.fonts.serif }}>
                Real-Time Routing
              </h4>
            </div>
            <Layers className="h-5 w-5 text-teal-500" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[9px] font-mono uppercase text-slate-400">
              <span>Context-Aware Decision System</span>
              <span className="text-teal-500">99.2%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
              <div className="h-full w-[92%] rounded-full bg-teal-500" />
            </div>
          </div>
        </div>
      </Reveal>

      <Connector color="indigo" />

      <BusinessNode
        level="L3"
        title="Optimized Experience"
        subtitle="Context-aware delivery to end users (interface)"
        icon={<Zap className="h-4 w-4 text-indigo-500" />}
        delay={220}
        highlight
      />

      <Reveal
        delay={320}
        className="mt-10 flex items-center gap-3 rounded-full border border-teal-500/20 bg-teal-500/5 px-5 py-2.5 backdrop-blur-md"
      >
        <RefreshCw className="h-4 w-4 animate-spin text-teal-500 [animation-duration:10s]" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-800">
          L4 • Experiment cycle optimization - Feedback adapts reasoning over time
        </span>
      </Reveal>
    </div>
  );
}

function BusinessNode({
  level,
  title,
  subtitle,
  icon,
  delay,
  highlight = false,
}: BusinessNodeProps) {
  return (
    <Reveal delay={delay} className="w-full max-w-sm">
      <div
        className={`w-full rounded-xl border p-5 backdrop-blur-sm ${
          highlight ? "border-indigo-500 bg-indigo-100 shadow-xl" : "border-white/5 bg-[#111113]"
        }`}
      >
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`text-[9px] font-mono uppercase tracking-widest ${
              highlight ? "text-indigo-900/60" : "text-slate-500"
            }`}
          >
            {level}
          </span>
          {icon}
        </div>

        <h5 className={`mb-1 text-sm font-semibold ${highlight ? "text-slate-900" : "text-slate-200"}`}>
          {title}
        </h5>

        <p className={`text-xs leading-relaxed ${highlight ? "text-slate-700" : "text-slate-500"}`}>
          {subtitle}
        </p>
      </div>
    </Reveal>
  );
}

function Connector({ color }: { color: "teal" | "indigo" }) {
  return (
    <div className="relative h-10 w-px bg-white/10">
      <div
        className={`absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-[1px] ${
          color === "teal" ? "bg-teal-500" : "bg-indigo-500"
        }`}
      />
    </div>
  );
}
