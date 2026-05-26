import { useState, useEffect } from "react";

const SplashScreen = ({ onFinished }: { onFinished: () => void }) => {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("hold"), 600);
    const exitTimer = setTimeout(() => setPhase("exit"), 2000);
    const doneTimer = setTimeout(() => onFinished(), 2700);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#064e3b] px-6 transition-opacity duration-700 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Sacred Glow */}
      <div
        className={`absolute w-64 h-64 rounded-full transition-all duration-1000 ease-out ${
          phase === "enter" ? "scale-0 opacity-0" : phase === "hold" ? "scale-100 opacity-60" : "scale-150 opacity-0"
        }`}
        style={{
          background: "radial-gradient(circle, #d4af37, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* YUSR Logo */}
      <img
        src="/logo.png"
        alt="YUSR"
        className={`relative w-40 h-40 object-contain transition-all duration-1000 ease-out ${
          phase === "enter" ? "scale-75 opacity-0 translate-y-10" : phase === "hold" ? "scale-100 opacity-100 translate-y-0" : "scale-110 opacity-0"
        }`}
      />

      {/* Brand title */}
      <h1
        className={`relative mt-8 font-urdu text-5xl font-black text-[#fdf6e3] transition-all duration-700 delay-300 ease-out ${
          phase === "enter" ? "translate-y-4 opacity-0" : phase === "hold" ? "translate-y-0 opacity-100" : "opacity-0"
        }`}
      >
        یسر (YUSR)
      </h1>

      <p
        className={`relative mt-4 text-xs font-bold tracking-[0.5em] uppercase text-[#d4af37] transition-all duration-700 delay-500 ease-out ${
          phase === "enter" ? "translate-y-4 opacity-0" : phase === "hold" ? "translate-y-0 opacity-60" : "opacity-0"
        }`}
      >
        Intelligent Quran Coach
      </p>

      {/* Elegant minimalist loader */}
      <div className={`mt-12 w-32 h-0.5 bg-[#fdf6e3]/10 overflow-hidden rounded-full transition-opacity duration-300 ${phase === "hold" ? "opacity-100" : "opacity-0"}`}>
        <div className="w-full h-full bg-[#d4af37] animate-[progress_2s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
