import Reveal from "@/src/components/hade/animation/Reveal";

const nodes = [
  { key: "H", label: "Human Signals", x: 140, y: 36 },
  { key: "A", label: "Adaptive Logic", x: 244, y: 140 },
  { key: "D", label: "Decision Layer", x: 140, y: 244 },
  { key: "E", label: "Experiment Loop", x: 36, y: 140 },
];

export function DiagramHADE() {
  return (
    <Reveal>
      <div className="panel relative overflow-hidden p-6">
        <svg viewBox="0 0 280 280" className="mx-auto w-full max-w-[320px]">
          <defs>
            <linearGradient id="hade-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#316BFF" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0b0d12" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          <circle cx="140" cy="140" r="104" fill="none" stroke="url(#hade-line)" strokeWidth="1.5" strokeDasharray="6 8" />

          {nodes.map((node, index) => (
            <g key={`${node.key}-edge`}>
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
            <g key={node.key}>
              <circle
                cx={node.x}
                cy={node.y}
                r="26"
                fill="#f8faff"
                stroke="#316BFF"
                strokeWidth="1.8"
                className="origin-center animate-pulse"
                style={{ animationDelay: `${i * 220}ms`, animationDuration: "2.6s" }}
              />
              <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill="#0b0d12">
                {node.key}
              </text>
              <text x={node.x} y={node.y + 42} textAnchor="middle" fontSize="10" fill="#3d4350">
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Reveal>
  );
}
