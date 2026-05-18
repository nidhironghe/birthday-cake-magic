import { useState } from "react";
import n1 from "./n1.jpeg"; // Trekking - Best
import n2 from "./n2.jpeg"; // Trekking - Ugly
import n3 from "./n3.jpeg"; // Concert - Best
import n4 from "./n4.jpeg"; // Concert - Ugly
import n5 from "./n5.jpeg"; // Final Page Image ⭐

interface Page {
  title: string;
  tagline: string;
  message: string;
  imageSrc: string;
  bg: string;
}

const pages: Page[] = [
  { 
    title: "In the middle of nowhere...", 
    tagline: "✨ When we look like this", 
    message: "", 
    imageSrc: n1, 
    bg: "oklch(0.94 0.05 140)" 
  },
  { 
    title: "...or on top of mountains", 
    tagline: "💀 and even when we look like this", 
    message: "Sweaty, exhausted, questioning our life choices, and completely out of breath... but still laughing.", 
    imageSrc: n2, 
    bg: "oklch(0.93 0.04 110)" 
  },
  { 
    title: "At a Concert...", 
    tagline: "when we look like that 🔥", 
    message: "Dressed up, screaming lyrics, the bass thumping in our chests, and matching each other's golden energy.", 
    imageSrc: n3, 
    bg: "oklch(0.92 0.07 320)" 
  },
  { 
    title: "...or just existing", 
    tagline: "🤪 and even when we look like this", 
    message: "Blurry camera angles, smudged faces. No matter where we are or what we look like—I'd always want to go with you.", 
    imageSrc: n4, 
    bg: "oklch(0.95 0.06 350)" 
  },
];

export default function Scrapbook() {
  const [turned, setTurned] = useState<boolean[]>(pages.map(() => false));

  const flip = (i: number) => {
    setTurned(t => t.map((v, idx) => idx === i ? !v : v));
  };

  return (
    <div 
      className="book relative mx-auto" 
      style={{ 
        width: "min(90vw, 600px)", 
        height: "480px",
        perspective: "1500px" // Gives depth to the page rotation
      }}
    >
      
      {/* Back cover / final page (n5) */}
      <div 
        className="absolute inset-0 rounded-2xl shadow-2xl bg-gradient-to-br from-[oklch(0.92_0.08_350)] to-[oklch(0.88_0.1_20)] flex flex-col justify-between p-6" 
        style={{ zIndex: 0 }}
      >
        <div className="text-center">
          <p className="font-display text-2xl text-foreground font-bold text-neutral-800">Happy birthdayyyy love🎀</p>
        </div>

        {/* Image container for n5 */}
        <div className="w-full flex-1 my-3 overflow-hidden rounded-xl border border-black/5 bg-white p-3 shadow-md">
          <img 
            src={n5} 
            alt="The End" 
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Pages mapping */}
      {pages.map((p, i) => {
        const isTurned = turned[i];
        
        // Dynamic Z-Index Calculation to hold pages in space correctly during execution
        const pageZIndex = isTurned ? i + 1 : pages.length - i;

        return (
          <div
            key={i}
            className={`page absolute inset-0 rounded-2xl shadow-xl ${isTurned ? "turned" : ""}`}
            style={{ 
              zIndex: pageZIndex,
              transformStyle: "preserve-3d", // Keeps child elements working in 3D space
              // Fixed delay logic: 
              // Moving forward -> delays drop in z-index until rotation passes 90 degrees (0.3s)
              // Moving backward -> instantly brings z-index back up so it renders on top
              transition: `transform 0.6s ease-in-out, z-index 0s linear ${isTurned ? "0.25s" : "0s"}`
            }}
          >
            {/* Front Face */}
            <div
              className="page-face absolute inset-0 rounded-2xl p-6 flex flex-col justify-between cursor-pointer"
              style={{ 
                background: p.bg,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
              onClick={() => flip(i)}
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-2xl font-black text-neutral-800">{p.title}</h3>
                <p className="font-display text-xs text-neutral-500 font-semibold bg-white/40 px-2 py-0.5 rounded-full">page {i + 1}</p>
              </div>

              {/* Image Container */}
              <div className="w-full flex-1 my-3 overflow-hidden rounded-xl border border-black/5 bg-white p-3 shadow-md flex flex-col justify-between">
                <div className="w-full flex-1 overflow-hidden rounded-lg">
                  <img 
                    src={p.imageSrc} 
                    alt={p.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-serif text-sm italic text-center mt-2 text-neutral-600 border-t border-dashed border-neutral-200 pt-2">
                  {p.tagline}
                </p>
              </div>

              {/* Small Message Below Image */}
              <div className="space-y-1">
                <p className="font-display text-sm text-center font-medium leading-tight px-2 text-neutral-700">
                  {p.message}
                </p>
                <p className="text-[10px] text-right text-neutral-400 tracking-wider uppercase font-bold">tap to turn →</p>
              </div>
            </div>

            {/* Back Face */}
            <div
              className="page-face page-back absolute inset-0 rounded-2xl p-8 flex items-center justify-center cursor-pointer bg-[oklch(0.97_0.02_30)] border-2 border-dashed border-neutral-300"
              style={{ 
                transform: "rotateY(180deg)", // Flips the back face component text around properly
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
              onClick={() => flip(i)}
            >
              <p className="font-display text-lg text-neutral-400 font-medium">← tap to flip back</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}