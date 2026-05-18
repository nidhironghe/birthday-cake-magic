import { useState } from "react";

interface Page {
  title: string;
  message: string;
  emoji: string;
  bg: string;
}

const pages: Page[] = [
  { title: "Day One", message: "From the day we met, you've made every moment brighter. Here's to all the laughs we've shared and the ones still coming.", emoji: "🌸", bg: "oklch(0.94 0.05 20)" },
  { title: "Adventures", message: "Every silly trip, every late night talk, every random burst of laughter — collected like little treasures.", emoji: "✨", bg: "oklch(0.93 0.06 60)" },
  { title: "Sunshine", message: "You light up rooms without trying. 21 looks really good on you.", emoji: "☀️", bg: "oklch(0.95 0.07 90)" },
  { title: "Always", message: "Wishing you the cutest, sparkliest year ahead. You deserve all the cake and confetti in the world.", emoji: "💖", bg: "oklch(0.92 0.08 10)" },
];

export default function Scrapbook() {
  const [turned, setTurned] = useState<boolean[]>(pages.map(() => false));

  const flip = (i: number) => {
    setTurned(t => t.map((v, idx) => idx === i ? !v : v));
  };

  return (
    <div className="book relative mx-auto" style={{ width: "min(90vw, 600px)", height: "400px" }}>
      {/* Back cover / final page */}
      <div className="absolute inset-0 rounded-2xl shadow-2xl bg-gradient-to-br from-[oklch(0.92_0.08_350)] to-[oklch(0.88_0.1_20)] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🎀</div>
          <p className="font-display text-3xl text-foreground">The end... for now</p>
          <p className="text-sm text-muted-foreground mt-2">flip back through the pages anytime</p>
        </div>
      </div>

      {pages.map((p, i) => (
        <div
          key={i}
          className={`page absolute inset-0 rounded-2xl shadow-xl ${turned[i] ? "turned" : ""}`}
          style={{ zIndex: pages.length - i }}
        >
          {/* Front */}
          <div
            className="page-face absolute inset-0 rounded-2xl p-8 flex flex-col justify-between cursor-pointer"
            style={{ background: p.bg }}
            onClick={() => flip(i)}
          >
            <div>
              <p className="font-display text-sm text-muted-foreground">page {i + 1}</p>
              <h3 className="font-serif text-4xl mt-2">{p.title}</h3>
            </div>
            <div className="text-7xl text-center wiggle">{p.emoji}</div>
            <p className="font-display text-2xl leading-tight">{p.message}</p>
            <p className="text-xs text-right text-muted-foreground">tap to turn →</p>
          </div>
          {/* Back */}
          <div
            className="page-face page-back absolute inset-0 rounded-2xl p-8 flex items-center justify-center cursor-pointer bg-[oklch(0.97_0.02_30)]"
            onClick={() => flip(i)}
          >
            <p className="font-display text-2xl text-muted-foreground">← tap to flip back</p>
          </div>
        </div>
      ))}
    </div>
  );
}
