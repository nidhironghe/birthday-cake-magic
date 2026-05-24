import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import Cake from "@/components/Cake";
import WebcamSnap from "@/components/WebcamSnap";
import Scrapbook from "@/components/Scrapbook";
import Gift from "@/components/Gift";
import VogueCover from "@/components/VogueCover";

type Stage = "intro" | "blow" | "cut" | "snap" | "scrapbook" | "gift" | "vogue";

const TOTAL_SLICES = 8;

export default function App() {
  const [stage, setStage] = useState<Stage>("intro");
  const [candles, setCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [cuts, setCuts] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);

  const micRef = useRef<{ ctx: AudioContext; stream: MediaStream; raf: number } | null>(null);

  useEffect(() => {
    if (stage !== "blow") return;
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        src.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const loop = () => {
          analyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 4; i < 40; i++) sum += data[i];
          const avg = sum / 36;
          if (avg > 70) {
            setCandles(prev => {
              const idx = prev.findIndex(c => c);
              if (idx === -1) return prev;
              const next = [...prev];
              next[idx] = false;
              return next;
            });
          }
          micRef.current!.raf = requestAnimationFrame(loop);
        };
        micRef.current = { ctx, stream, raf: requestAnimationFrame(loop) };
      } catch {
        // silent - tap fallback still works
      }
    })();
    return () => {
      cancelled = true;
      if (micRef.current) {
        cancelAnimationFrame(micRef.current.raf);
        micRef.current.stream.getTracks().forEach(t => t.stop());
        micRef.current.ctx.close();
        micRef.current = null;
      }
    };
  }, [stage]);

  useEffect(() => {
    if (stage === "blow" && candles.every(c => !c)) {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
      setTimeout(() => setStage("cut"), 1200);
    }
  }, [candles, stage]);

  useEffect(() => {
    if (stage === "cut" && cuts >= TOTAL_SLICES) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      setTimeout(() => setStage("snap"), 1000);
    }
  }, [cuts, stage]);

  const blowCandle = (i: number) => {
    setCandles(prev => prev.map((c, idx) => idx === i ? false : c));
  };

  const cut = () => setCuts(c => Math.min(TOTAL_SLICES, c + 1));

  return (
    <main className="min-h-screen w-full px-4 py-10 flex flex-col items-center">
      <FloatingDecor />

      <header className="text-center mb-8 z-10">
        <p className="font-display text-3xl text-rose">happy birthday</p>
        <h1 className="font-serif text-6xl md:text-8xl tracking-tight text-foreground">
          Sia <span className="text-primary">♡</span>
        </h1>
      </header>

      {stage === "intro" && (
        <section className="z-10 flex flex-col items-center gap-6 max-w-lg text-center animate-in fade-in duration-700">
          <p className="font-display text-3xl leading-tight">
            i made you a tiny something. ready?
          </p>
          <button onClick={() => setStage("blow")}
            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-2xl hover:scale-105 transition">
            let's go 🎂
          </button>
        </section>
      )}

      {stage === "blow" && (
        <section className="z-10 flex flex-col items-center gap-4 animate-in fade-in duration-500">
          <p className="font-display text-2xl">blow the candles (or tap them) 🌬️</p>
          <Cake
            candlesLit={candles}
            onBlow={blowCandle}
            slicePaths={[]}
            cutCount={0}
            onCut={cut}
            stage="blow"
          />
        </section>
      )}

      {stage === "cut" && (
        <section className="z-10 flex flex-col items-center gap-4 animate-in fade-in duration-500">
          <p className="font-display text-2xl">now cut the cake into slices 🔪</p>
          <p className="text-sm text-muted-foreground">tap each piece — {cuts}/{TOTAL_SLICES}</p>
          <Cake
            candlesLit={candles}
            onBlow={blowCandle}
            slicePaths={[]}
            cutCount={cuts}
            onCut={cut}
            stage="cut"
          />
        </section>
      )}

      {stage === "snap" && (
        <section className="z-10 flex flex-col items-center gap-4 animate-in fade-in duration-500">
          <p className="font-display text-3xl">say cheese, birthday girl 🧀</p>
          <WebcamSnap onDone={(img) => { setPhoto(img); setStage("scrapbook"); }} />
        </section>
      )}

      {stage === "scrapbook" && (
        <section className="z-10 flex flex-col items-center gap-6 animate-in fade-in duration-500">
          <p className="font-display text-3xl">🫶🏻</p>
          <Scrapbook />
          <button onClick={() => setStage("gift")}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:scale-105 transition">
            one last thing →
          </button>
        </section>
      )}

      {stage === "gift" && (
        <section className="z-10 flex flex-col items-center gap-4 animate-in fade-in duration-500">
          <p className="font-display text-3xl">a gift for you 🎁</p>
          <Gift photo={photo} onNext={() => setStage("vogue")} />
        </section>
      )}

      {stage === "vogue" && (
        <section className="z-10 flex flex-col items-center gap-4 animate-in fade-in duration-500">
          <VogueCover />
        </section>
      )}

      <footer className="mt-auto pt-12 text-xs text-muted-foreground font-display text-lg z-10">
        made with 💖 just for you
      </footer>
    </main>
  );
}

function FloatingDecor() {
  const items = ["🎈", "🌸", "✨", "🎀", "💖", "🧁"];
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({ length: 14 }).map((_, i) => {
        const left = (i * 37) % 100;
        const delay = (i % 5) * 0.7;
        const size = 18 + (i % 4) * 8;
        return (
          <span key={i}
            style={{
              left: `${left}%`,
              fontSize: size,
              animation: `floatY ${6 + (i % 5)}s ease-in-out ${delay}s infinite`,
              top: `${(i * 13) % 90}%`,
              position: "absolute",
              opacity: 0.6,
            }}>
            {items[i % items.length]}
          </span>
        );
      })}
      <style>{`@keyframes floatY { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-20px) rotate(10deg)} }`}</style>
    </div>
  );
}