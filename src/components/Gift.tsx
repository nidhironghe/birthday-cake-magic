import { useState } from "react";

export default function Gift({ photo }: { photo: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-center">
      {!open ? (
        <button onClick={() => setOpen(true)} className="group relative hover:scale-105 transition">
          <svg viewBox="0 0 200 220" className="w-64 drop-shadow-2xl">
            {/* Box bottom */}
            <rect x={20} y={80} width={160} height={130} rx={6} fill="oklch(0.72 0.16 5)" />
            <rect x={20} y={80} width={160} height={130} rx={6} fill="url(#shine)" opacity="0.3" />
            {/* Lid */}
            <rect x={15} y={70} width={170} height={30} rx={6} fill="oklch(0.65 0.18 5)"
              className="group-hover:-translate-y-2 transition-transform" />
            {/* Vertical ribbon */}
            <rect x={90} y={70} width={20} height={140} fill="oklch(0.95 0.1 90)" />
            {/* Bow */}
            <g className="wiggle" style={{ transformOrigin: "100px 60px" }}>
              <ellipse cx={75} cy={55} rx={28} ry={18} fill="oklch(0.95 0.1 90)" />
              <ellipse cx={125} cy={55} rx={28} ry={18} fill="oklch(0.95 0.1 90)" />
              <circle cx={100} cy={55} r={12} fill="oklch(0.9 0.13 85)" />
            </g>
            <defs>
              <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="white" />
                <stop offset="1" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
          <p className="font-display text-2xl mt-2">tap to open 🎁</p>
        </button>
      ) : (
        <div className="animate-in fade-in zoom-in duration-700 flex flex-col items-center gap-4">
          <div className="relative p-4 bg-white rounded-2xl shadow-2xl rotate-[3deg]" style={{ width: "min(80vw, 340px)" }}>
            {photo ? (
              <img src={photo} alt="Sia" className="w-full aspect-square object-cover rounded-xl" />
            ) : (
              <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-pink to-gold flex items-center justify-center text-8xl">
                💝
              </div>
            )}
            <p className="font-display text-3xl text-center mt-3">Sia, 21 ✨</p>
            <p className="text-xs text-center text-muted-foreground">— a tiny piece of today</p>
          </div>
          <p className="font-display text-2xl text-center max-w-md">
            Happy birthday, gorgeous. Here's to your brightest year yet 💖
          </p>
        </div>
      )}
    </div>
  );
}
