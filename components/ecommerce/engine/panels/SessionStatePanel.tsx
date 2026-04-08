import type { SessionSignals } from "../types";

function formatSeconds(value: number) {
  return `${value.toFixed(1)}s`;
}

interface SessionStatePanelProps {
  sessionSignals: SessionSignals;
}

export default function SessionStatePanel({ sessionSignals }: SessionStatePanelProps) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}>
      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">Session State</p>
      <div className="space-y-3">
        <div>
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-ink/32">Continuous Tracking</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-ink/8 bg-white/75 px-2.5 py-1 text-[10px] font-mono text-ink/55">
              scroll {Math.round(sessionSignals.scrollDepth)}%
            </span>
            <span className="rounded-full border border-ink/8 bg-white/75 px-2.5 py-1 text-[10px] font-mono text-ink/55">
              page {formatSeconds(sessionSignals.timeOnPage)}
            </span>
            <span className="rounded-full border border-ink/8 bg-white/75 px-2.5 py-1 text-[10px] font-mono text-ink/55">
              idle {formatSeconds(sessionSignals.idleTime)}
            </span>
          </div>
        </div>

        <div>
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-ink/32">Touch Interactions</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-ink/8 bg-white/75 px-2.5 py-1 text-[10px] font-mono text-ink/55">
              taps {sessionSignals.tapCount}
            </span>
            <span className="rounded-full border border-ink/8 bg-white/75 px-2.5 py-1 text-[10px] font-mono text-ink/55">
              long press {sessionSignals.longPressCount}
            </span>
          </div>
        </div>

        <div>
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-ink/32">Persistence</p>
          <p className="text-sm font-semibold text-ink/55">Signals are stored locally and restored on reload.</p>
        </div>
      </div>
    </div>
  );
}
