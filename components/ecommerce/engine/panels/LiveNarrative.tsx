import { motion } from "framer-motion";
import type { BehaviorState } from "../types";

interface LiveNarrativeProps {
  stateKey: string;
  dynamicNarrative: string;
  causeEffectMessage: string;
}

export default function LiveNarrative({ stateKey, dynamicNarrative, causeEffectMessage }: LiveNarrativeProps) {
  return (
    <motion.div
      key={stateKey}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="mb-6 rounded-2xl border px-4 py-3"
      style={{
        background: "rgba(255,255,255,0.72)",
        borderColor: "rgba(11,13,18,0.08)",
      }}
    >
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/38">Live Narrative</p>
      <p className="mt-1 text-sm font-medium text-ink/62">{dynamicNarrative}</p>
      <p className="mt-2 text-[11px] leading-relaxed text-ink/50">{causeEffectMessage}</p>
    </motion.div>
  );
}
