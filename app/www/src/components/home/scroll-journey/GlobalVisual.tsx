import { Globe, Zap } from "lucide-react";

export const GlobalVisual = ({ progress }: { progress: number }) => {
  const stepProgress = Math.max(0, Math.min(1, (progress - 0.6) * 5)); // 60-80%

  // Node positions around the globe
  const nodes = [
    { x: 50, y: 20, label: "US-East", delay: 0 },
    { x: 85, y: 35, label: "EU-West", delay: 0.1 },
    { x: 75, y: 65, label: "Asia", delay: 0.2 },
    { x: 25, y: 50, label: "US-West", delay: 0.15 },
    { x: 60, y: 80, label: "Australia", delay: 0.25 },
  ];

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {/* Globe visualization */}
      <div className="relative w-64 h-64">
        {/* Globe background */}
        <div className="absolute inset-0 rounded-full border border-purple-500/20 bg-purple-500/5" />

        {/* Latitude lines */}
        {[25, 50, 75].map((top) => (
          <div
            key={top}
            className="absolute left-4 right-4 border-t border-dashed border-purple-500/10"
            style={{ top: `${top}%` }}
          />
        ))}

        {/* Longitude lines */}
        {[25, 50, 75].map((left) => (
          <div
            key={left}
            className="absolute top-4 bottom-4 border-l border-dashed border-purple-500/10"
            style={{ left: `${left}%` }}
          />
        ))}

        {/* Connection lines between nodes */}
        <svg className="absolute inset-0 w-full h-full">
          {nodes.map((node, i) => {
            const nextNode = nodes[(i + 1) % nodes.length];
            const lineProgress = Math.max(0, (stepProgress - node.delay) * 2);
            return (
              <line
                key={i}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${nextNode.x}%`}
                y2={`${nextNode.y}%`}
                stroke="rgba(168, 85, 247, 0.3)"
                strokeWidth="1"
                strokeDasharray="4 4"
                style={{ opacity: Math.min(1, lineProgress) }}
              />
            );
          })}
        </svg>

        {/* Edge nodes */}
        {nodes.map((node, i) => {
          const nodeProgress = Math.max(0, (stepProgress - node.delay) * 2);
          const scale = 0.5 + Math.min(1, nodeProgress) * 0.5;
          const opacity = Math.min(1, nodeProgress);

          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
              }}
            >
              {/* Pulse effect */}
              <div
                className="absolute w-8 h-8 rounded-full bg-purple-500/30 animate-ping"
                style={{ animationDelay: `${node.delay}s` }}
              />
              {/* Node dot */}
              <div className="relative w-3 h-3 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50" />
              {/* Label */}
              <span className="absolute top-5 text-[10px] text-purple-300/60 whitespace-nowrap">
                {node.label}
              </span>
            </div>
          );
        })}

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <Globe className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Latency indicator */}
      <div className="mt-6 flex items-center gap-4 text-xs text-white/40">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-amber-400" />
          <span>&lt;50ms global latency</span>
        </div>
      </div>
    </div>
  );
};
