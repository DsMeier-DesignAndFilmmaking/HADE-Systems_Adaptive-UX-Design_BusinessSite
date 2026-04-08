import { AnimatePresence, motion } from "framer-motion";
import type { RankedProduct, RankDeltaMap, SessionSignals } from "../types";
import { GOLD } from "../config";

function formatSeconds(value: number) {
  return `${value.toFixed(1)}s`;
}

interface ProductCardProps {
  product: RankedProduct;
  index: number;
  isHovered: boolean;
  isClicked: boolean;
  rankChanged: boolean;
  rankDeltaMap: RankDeltaMap;
  sessionSignals: SessionSignals;
  onStartDwell: (id: string) => void;
  onStopDwell: (id: string) => void;
  onTouchStart: (id: string) => void;
  onTouchEnd: (id: string) => void;
  onClick: (id: string) => void;
}

export default function ProductCard({
  product,
  index,
  isHovered,
  isClicked,
  rankChanged,
  rankDeltaMap,
  sessionSignals,
  onStartDwell,
  onStopDwell,
  onTouchStart,
  onTouchEnd,
  onClick,
}: ProductCardProps) {
  const isCompared = product.isCompared;
  const isLeader = index === 0 && product.score > 0;
  const isRising = (rankDeltaMap[product.id] ?? 0) > 0;
  const isTrending =
    product.score > 0.55 || product.signals.clicks > 0 || product.signals.revisits > 0 || sessionSignals.tapCount > 0;

  return (
    <motion.div
      key={product.id}
      layout
      animate={isClicked ? { scale: 0.985 } : { scale: 1 }}
      transition={{ layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }, duration: 0.18 }}
      onMouseEnter={() => onStartDwell(product.id)}
      onMouseLeave={() => onStopDwell(product.id)}
      onTouchStart={() => onTouchStart(product.id)}
      onTouchEnd={() => onTouchEnd(product.id)}
      onTouchCancel={() => onTouchEnd(product.id)}
      onClick={() => onClick(product.id)}
      className="relative cursor-pointer overflow-hidden rounded-2xl border bg-white p-4 transition-colors select-none touch-manipulation"
      style={{
        borderColor: isLeader
          ? GOLD
          : rankChanged
          ? "rgba(196,146,42,0.45)"
          : isCompared
          ? "rgba(196,146,42,0.28)"
          : isHovered
          ? "rgba(196,146,42,0.32)"
          : "rgba(11,13,18,0.08)",
        boxShadow: rankChanged
          ? "0 14px 30px rgba(196,146,42,0.18)"
          : isHovered
          ? "0 8px 24px rgba(196,146,42,0.10)"
          : "none",
        background: isLeader
          ? "rgba(196,146,42,0.05)"
          : isCompared
          ? "rgba(196,146,42,0.03)"
          : "rgba(255,255,255,0.92)",
      }}
    >
      <AnimatePresence>
        {rankChanged && (
          <motion.div
            initial={{ opacity: 0.45 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0"
            style={{ background: "rgba(196,146,42,0.14)" }}
          />
        )}
      </AnimatePresence>

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em]"
              style={{
                background: isLeader ? "rgba(196,146,42,0.12)" : "rgba(11,13,18,0.04)",
                color: isLeader ? GOLD : "rgba(11,13,18,0.5)",
              }}
            >
              Rank {index + 1}
            </span>
            {isRising && (
              <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-green-700">
                Rising
              </span>
            )}
            {isTrending && !isLeader && (
              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-700">
                Trending
              </span>
            )}
            {isLeader && (
              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-700">
                Based on your behavior
              </span>
            )}
            {rankChanged && (
              <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-green-700">
                Ranking Shift
              </span>
            )}
          </div>
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD, opacity: 0.7 }}>
            {product.category}
          </p>
          <p className="text-sm font-semibold leading-snug text-ink">{product.name}</p>
          <p className="mt-0.5 text-xs text-ink/40">{product.material}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-ink/8 bg-ink/[0.03] px-2.5 py-1 text-[10px] font-mono text-ink/55">
              dwell {formatSeconds(product.signals.dwellTime)}
            </span>
            <span className="rounded-full border border-ink/8 bg-ink/[0.03] px-2.5 py-1 text-[10px] font-mono text-ink/55">
              clicks {product.signals.clicks}
            </span>
            <span className="rounded-full border border-ink/8 bg-ink/[0.03] px-2.5 py-1 text-[10px] font-mono text-ink/55">
              revisits {product.signals.revisits}
            </span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-base font-bold text-ink">{product.price}</p>
          <motion.p
            key={`${product.id}-${product.score}`}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-[10px] font-mono"
            style={{ color: product.score > 0 ? GOLD : "rgba(11,13,18,0.25)" }}
          >
            score {product.score.toFixed(2)}
          </motion.p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-transparent">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "linear", repeat: Infinity }}
              className="h-full rounded-full origin-left"
              style={{ background: GOLD, opacity: 0.5 }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
