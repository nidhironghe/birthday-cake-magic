import { useEffect, useRef, useState } from "react";

interface CakeProps {
  candlesLit: boolean[];
  onBlow: (index: number) => void;
  slicePaths: string[];
  cutCount: number;
  onCut: () => void;
  stage: "blow" | "cut" | "done";
}

// 8 slices around the cake
const SLICE_COUNT = 8;

export default function Cake({ candlesLit, onBlow, cutCount, onCut, stage }: CakeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [knife, setKnife] = useState<{ x: number; y: number } | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (stage !== "cut" || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return;
    const loc = pt.matrixTransform(ctm.inverse());
    setKnife({ x: loc.x, y: loc.y });
  };
  const cx = 200;
  const cy = 220;
  const r = 130;
  const candles = Array.from({ length: 5 }, (_, i) => {
    const angle = (Math.PI * (0.2 + i * 0.15));
    return { x: cx + Math.cos(angle) * 60, y: cy - 80 + Math.sin(angle) * 10, lit: candlesLit[i] };
  });

  // Build slice wedges
  const slices = Array.from({ length: SLICE_COUNT }, (_, i) => {
    const a1 = (i / SLICE_COUNT) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / SLICE_COUNT) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r * 0.55; // ellipse
    const x2 = cx + Math.cos(a2) * r;
    const y2 = cy + Math.sin(a2) * r * 0.55;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r * 0.55} 0 0 1 ${x2} ${y2} Z`;
    const mid = (a1 + a2) / 2;
    return { path, cut: i < cutCount, mid, idx: i };
  });

  return (
    <div className="relative flex flex-col items-center">
      <svg
        ref={svgRef}
        viewBox="0 0 400 380"
        className={`w-full max-w-md drop-shadow-2xl ${stage === "cut" ? "cursor-none" : ""}`}
        onMouseMove={handleMove}
        onMouseLeave={() => setKnife(null)}
      >
        {/* Plate */}
        <ellipse cx={cx} cy={cy + 90} rx={170} ry={20} fill="oklch(0.88 0.04 25)" opacity="0.5" />
        <ellipse cx={cx} cy={cy + 85} rx={160} ry={18} fill="white" />

        {/* Cake body (side) */}
        <path d={`M ${cx - r} ${cy} L ${cx - r} ${cy + 70} A ${r} ${r * 0.3} 0 0 0 ${cx + r} ${cy + 70} L ${cx + r} ${cy} Z`}
          fill="oklch(0.78 0.1 25)" />
        {/* Drip frosting */}
        <path d={`M ${cx - r} ${cy + 10}
          q 20 25 40 0 q 20 30 40 0 q 20 25 40 0 q 20 30 40 0 q 20 25 40 0 q 20 30 40 0 q 20 25 40 0
          L ${cx + r} ${cy} L ${cx - r} ${cy} Z`}
          fill="oklch(0.95 0.04 20)" />

        {/* Top - sliced wedges */}
        <g>
          {slices.map((s) => (
            <g key={s.idx}>
              <path
                d={s.path}
                fill="oklch(0.92 0.05 20)"
                stroke={s.cut ? "oklch(0.55 0.1 15)" : "oklch(0.88 0.04 20)"}
                strokeWidth={s.cut ? 2 : 0.5}
                style={{
                  transform: s.cut ? `translate(${Math.cos(s.mid) * 8}px, ${Math.sin(s.mid) * 4}px)` : undefined,
                  transition: "transform 0.5s ease",
                  transformOrigin: `${cx}px ${cy}px`,
                }}
              />
            </g>
          ))}
        </g>

        {/* Sprinkles */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const rr = 30 + (i % 3) * 25;
          const colors = ["#f472b6", "#fbbf24", "#a78bfa", "#34d399"];
          return (
            <circle key={i} cx={cx + Math.cos(a) * rr} cy={cy + Math.sin(a) * rr * 0.55}
              r={2.5} fill={colors[i % 4]} />
          );
        })}

        {/* Candles */}
        {candles.map((c, i) => (
          <g key={i}>
            <rect x={c.x - 4} y={c.y} width={8} height={40} fill={`hsl(${i * 60}, 80%, 70%)`} rx={1} />
            {c.lit && (
              <>
                <line x1={c.x} y1={c.y} x2={c.x} y2={c.y - 8} stroke="#444" strokeWidth={1} />
                <g className="flame" style={{ transformOrigin: `${c.x}px ${c.y - 8}px` }}>
                  <ellipse cx={c.x} cy={c.y - 16} rx={5} ry={10} fill="#fbbf24" />
                  <ellipse cx={c.x} cy={c.y - 18} rx={3} ry={7} fill="#fef3c7" />
                </g>
              </>
            )}
          </g>
        ))}

        {/* Cut lines overlay when in cut stage */}
        {stage === "cut" && (
          <g>
            {slices.map((s) => !s.cut && (
              <path
                key={`hit-${s.idx}`}
                d={s.path}
                fill="transparent"
                stroke="oklch(0.72 0.16 5 / 0.4)"
                strokeWidth={1}
                strokeDasharray="4 3"
                className="cursor-pointer hover:fill-[oklch(0.72_0.16_5_/_0.15)]"
                onClick={onCut}
              />
            ))}
          </g>
        )}

        {/* Blow hit areas */}
        {stage === "blow" && candles.map((c, i) => c.lit && (
          <circle key={`blow-${i}`} cx={c.x} cy={c.y - 10} r={20} fill="transparent"
            className="cursor-pointer" onClick={() => onBlow(i)} />
        ))}
      </svg>
    </div>
  );
}
