"use client";

import { motion } from "framer-motion";

const nodes = [
  { key: "H", label: "Human Signals", x: 140, y: 36 },
  { key: "A", label: "Adaptive Logic", x: 244, y: 140 },
  { key: "D", label: "Decision Layer", x: 140, y: 244 },
  { key: "E", label: "Experiment Loop", x: 36, y: 140 }
];

export function DiagramHADE() {
  return (
    <motion.div
      className="panel relative overflow-hidden p-6"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45 }}
    >
      <svg viewBox="0 0 280 280" className="mx-auto w-full max-w-[320px]">
        <defs>
          <linearGradient id="hade-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#316BFF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0b0d12" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        <circle cx="140" cy="140" r="104" fill="none" stroke="url(#hade-line)" strokeWidth="1.5" strokeDasharray="6 8" />

        {nodes.map((node, index) => (
          <g key={node.key}>
            <line
              x1={node.x}
              y1={node.y}
              x2={nodes[(index + 1) % nodes.length].x}
              y2={nodes[(index + 1) % nodes.length].y}
              stroke="url(#hade-line)"
              strokeWidth="1.5"
              opacity="0.5"
            />
          </g>
        ))}

        {nodes.map((node, i) => (
          <motion.g key={node.key} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08, duration: 0.35 }}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="26"
              fill="#f8faff"
              stroke="#316BFF"
              strokeWidth="1.8"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.25 }}
            />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill="#0b0d12">
              {node.key}
            </text>
            <text x={node.x} y={node.y + 42} textAnchor="middle" fontSize="10" fill="#3d4350">
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
}
