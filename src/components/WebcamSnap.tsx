import { useEffect, useRef, useState } from "react";

export default function WebcamSnap({ onDone }: { onDone: (img: string | null) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [shot, setShot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Helper function to mount camera tracks cleanly
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e: any) {
      setError("Couldn't access camera. You can skip this step!");
    }
  };

  useEffect(() => {
    startCamera();
    return () => { stream?.getTracks().forEach(t => t.stop()); };
    // eslint-disable-next-line
  }, []);

  // FIXED: Retake function clears the image AND cleanly wakes the video stream back up
  const handleRetake = async () => {
    setShot(null);
    setCountdown(null);
    // Give React a split second to re-render the HTML5 <video> element before attaching the stream
    setTimeout(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      } else {
        startCamera();
      }
    }, 50);
  };

  const snap = () => {
    setCountdown(3);
    let n = 3;
    const tick = setInterval(() => {
      n--;
      if (n <= 0) {
        clearInterval(tick);
        setCountdown(null);
        const v = videoRef.current;
        if (!v) return;
        const canvas = document.createElement("canvas");
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(v, 0, 0);
        setShot(canvas.toDataURL("image/jpeg", 0.9));
      } else {
        setCountdown(n);
      }
    }, 1000);
  };

  const handleDownload = () => {
    if (!shot) return;
    const link = document.createElement("a");
    link.href = shot;
    link.download = "cute-birthday-snap.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-black/10 border-8 border-white shadow-2xl rotate-[-2deg]">
        {error ? (
          <div className="flex h-full items-center justify-center p-6 text-center text-muted-foreground">{error}</div>
        ) : shot ? (
          <img src={shot} alt="Birthday snap" className="w-full h-full object-cover" />
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="font-display text-white text-[180px] leading-none">{countdown}</span>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {!shot && !error && (
          <button onClick={snap} disabled={countdown !== null}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50">
            📸 Take photo
          </button>
        )}
        
        {shot && (
          <>
            <button onClick={handleDownload}
              className="px-6 py-3 rounded-full bg-neutral-800 text-white font-semibold shadow hover:bg-neutral-700 active:scale-95 transition">
              💾 Download
            </button>
            {/* Swapped out old onClick setter for the new handleRetake system */}
            <button onClick={handleRetake}
              className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold shadow">
              Retake
            </button>
            <button onClick={() => onDone(shot)}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:scale-105 transition">
              Looks cute → next
            </button>
          </>
        )}
        
        {error && (
          <button onClick={() => onDone(null)}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow">
            Skip →
          </button>
        )}
      </div>
    </div>
  );
}