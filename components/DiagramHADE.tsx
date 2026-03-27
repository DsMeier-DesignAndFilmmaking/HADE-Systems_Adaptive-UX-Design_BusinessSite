import Reveal from "@/src/components/hade/animation/Reveal";

/** * UPDATED COORDINATES: 
 * Canvas increased to 400x400 to prevent label overflow.
 * Radius centered at 200, 200.
 */
const nodes = [
  { key: "H", label: "Human Signals", x: 200, y: 70 },    // Top
  { key: "A", label: "Adaptive Logic", x: 330, y: 200 }, // Right
  { key: "D", label: "Decision Layer", x: 200, y: 330 }, // Bottom
  { key: "E", label: "Experiment Loop", x: 70, y: 200 },  // Left
];

export function DiagramHADE() {
  return (
    <Reveal>
      <div className="panel relative overflow-hidden p-8">
        {/* Increased viewBox to 400x400 to give labels 'padding' inside the SVG */}
        <svg 
          viewBox="0 0 400 400" 
          className="mx-auto w-full max-w-[400px] drop-shadow-sm"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hade-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#316BFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#316BFF" stopOpacity="0.2" />
            </linearGradient>
            {/* Subtle glow filter for the nodes */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Orbit Ring */}
          <circle 
            cx="200" 
            cy="200" 
            r="130" 
            stroke="#316BFF" 
            strokeWidth="1" 
            strokeDasharray="4 6" 
            opacity="0.15" 
          />

          {/* Connection Lines (Polygons) */}
          <g>
            {nodes.map((node, index) => {
              const nextNode = nodes[(index + 1) % nodes.length];
              return (
                <line
                  key={`edge-${index}`}
                  x1={node.x}
                  y1={node.y}
                  x2={nextNode.x}
                  y2={nextNode.y}
                  stroke="url(#hade-line)"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                />
              );
            })}
          </g>

          {/* Nodes and Labels */}
          {nodes.map((node, i) => (
            <g key={node.key} className="select-none">
              {/* Node Outer Halo */}
              <circle
                cx={node.x}
                cy={node.y}
                r="28"
                fill="white"
                className="animate-pulse"
                style={{ animationDelay: `${i * 400}ms`, animationDuration: '4s', opacity: 0.5 }}
              />
              
              {/* Main Node Circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r="22"
                fill="white"
                stroke="#316BFF"
                strokeWidth="2"
                style={{ filter: 'url(#glow)' }}
              />
              
              {/* Large Letter Key */}
              <text 
                x={node.x} 
                y={node.y + 6} 
                textAnchor="middle" 
                fontSize="16" 
                fontWeight="700" 
                fill="#0b0d12" 
                className="font-sans"
              >
                {node.key}
              </text>
              
              {/* Label - Positioned strategically based on node location */}
              <text 
                x={node.x} 
                y={node.key === "H" ? node.y - 40 : node.key === "D" ? node.y + 50 : node.y + 45} 
                textAnchor="middle" 
                fontSize="11" 
                fontWeight="600"
                fill="#3d4350"
                className="uppercase tracking-[0.1em]"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Reveal>
  );
}