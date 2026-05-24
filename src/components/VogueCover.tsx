import siaPhoto from "./s1.jpeg";

export default function VogueCover() {

  const handleDownload = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = siaPhoto;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 340;
      canvas.height = 460;
      const ctx = canvas.getContext("2d")!;

      // Draw photo
      ctx.drawImage(img, 0, 0, 340, 460);

      // Dark overlay
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, 340, 460);

      // VOGUE
      ctx.fillStyle = "white";
      ctx.font = "900 62px serif";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 12;
      ctx.fillText("VOGUE", 170, 70);

      // Edition
      ctx.font = "11px sans-serif";
      ctx.shadowBlur = 0;
      ctx.fillText("BIRTHDAY EDITION • MAY 2026", 170, 92);

      // Left headlines
      ctx.textAlign = "left";
      ctx.font = "bold 10px sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 4;
      ctx.fillText("TURNING 21", 12, 130);
      ctx.font = "10px sans-serif";
      ctx.fillText("everything she touches", 12, 144);
      ctx.fillText("turns iconic", 12, 156);
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("TAURUS SZN", 12, 180);
      ctx.font = "10px sans-serif";
      ctx.fillText("stunning", 12, 194);
      ctx.fillText("& unstoppable", 12, 206);

      // Right headlines
      ctx.textAlign = "right";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("GLOW UP", 328, 130);
      ctx.font = "10px sans-serif";
      ctx.fillText("scientists baffled,", 328, 144);
      ctx.fillText("we are not", 328, 156);
      ctx.font = "bold 10px sans-serif";

      // Bottom gradient
      const grad = ctx.createLinearGradient(0, 370, 0, 460);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx.fillStyle = grad;
      ctx.shadowBlur = 0;
      ctx.fillRect(0, 370, 340, 90);

      // Bottom text
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.font = "900 18px serif";
      ctx.fillText("SIA", 16, 415);
      ctx.font = "11px sans-serif";
      ctx.fillText("21 & Iconic: A Birthday Story", 16, 432);
      ctx.fillStyle = "#f9a8d4";
      ctx.font = "10px sans-serif";
      ctx.fillText("She ate and left no crumbs ✦", 16, 446);

      // Barcode
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "7px monospace";
      ctx.textAlign = "right";
      ctx.fillText("MAY 2026 •", 332, 455);

      // Download
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.download = "sia-vogue-cover.jpg";
      link.click();
    };
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
      <div className="relative w-[500px] h-[620px] overflow-hidden shadow-2xl rounded-sm">
        {/* Photo */}
        <img src={siaPhoto} alt="Sia" className="w-full h-full object-cover object-top" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* VOGUE logo */}
        <div className="absolute top-4 left-0 right-0 flex justify-center">
          <span style={{ fontFamily: "serif", fontSize: 64, fontWeight: 900, color: "white", letterSpacing: 8, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
            VOGUE
          </span>
        </div>

        {/* Edition */}
        <div className="absolute top-[78px] left-0 right-0 flex justify-center">
          <span style={{ color: "white", fontSize: 12, letterSpacing: 4, fontFamily: "sans-serif" }}>
            BIRTHDAY EDITION • MAY 2026
          </span>
        </div>

        {/* Left headlines */}
        <div className="absolute left-3 top-28 flex flex-col gap-3 max-w-[90px]">
          <p style={{ color: "white", fontSize: 14, fontWeight: 700, lineHeight: 1.3, textShadow: "0 1px 4px rgba(0,0,0,0.7)", fontFamily: "sans-serif" }}>
            TURNING 21<br />
            <span style={{ fontWeight: 400 }}>everything she touches turns iconic</span>
          </p>
          <p style={{ color: "white", fontSize: 14, fontWeight: 700, lineHeight: 1.3, textShadow: "0 1px 4px rgba(0,0,0,0.7)", fontFamily: "sans-serif" }}>
            TAURUS SZN<br />
            <span style={{ fontWeight: 400 }}>stunning & unstoppable</span>
          </p>
        </div>

        {/* Right headlines */}
        <div className="absolute right-3 top-28 flex flex-col gap-3 max-w-[90px] text-right">
          <p style={{ color: "white", fontSize: 14, fontWeight: 700, lineHeight: 1.3, textShadow: "0 1px 4px rgba(0,0,0,0.7)", fontFamily: "sans-serif" }}>
            GLOW UP<br />
            <span style={{ fontWeight: 400 }}>scientists baffled, we are not</span>
          </p>
        </div>

        {/* Bottom headline */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-8 bg-gradient-to-t from-black/70 to-transparent">
          <p style={{ color: "white", fontSize: 18, fontWeight: 900, fontFamily: "serif", lineHeight: 1.2, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            SIA
          </p>
          <p style={{ color: "white", fontSize: 11, fontFamily: "sans-serif", marginTop: 2 }}>
            21 & Iconic: A Birthday Story
          </p>
          <p style={{ color: "#f9a8d4", fontSize: 10, fontFamily: "sans-serif", marginTop: 1 }}>
            She ate and left no crumbs ✦
          </p>
        </div>

        {/* Barcode area */}
        <div className="absolute bottom-3 right-3">
          <p style={{ color: "white", fontSize: 7, fontFamily: "monospace", opacity: 0.7 }}>MAY 2026</p>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:scale-105 transition"
      >
        save your cover 🖼️
      </button>
    </div>
  );
}