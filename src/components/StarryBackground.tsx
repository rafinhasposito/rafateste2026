import { useEffect, useRef } from "react";

const StarryBackground = () => {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;

    // Create stars
    for (let i = 0; i < 250; i++) {
      const star = document.createElement("div");
      star.className = `star ${Math.random() > 0.92 ? "bright" : ""}`;
      const size = Math.random() * 2 + 0.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.setProperty("--duration", `${Math.random() * 8 + 3}s`);
      star.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(star);
    }

    // Create subtle constellation lines
    for (let i = 0; i < 8; i++) {
      const line = document.createElement("div");
      line.className = "constellation-line";
      line.style.top = `${Math.random() * 80 + 10}%`;
      line.style.left = `${Math.random() * 60}%`;
      line.style.width = `${Math.random() * 200 + 50}px`;
      line.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(line);
    }

    return () => { container.innerHTML = ""; };
  }, []);

  return (
    <>
      <div className="cosmic-canvas" />
      <div className="nebula-layer" />
      <div ref={starsRef} className="fixed inset-0 z-[-1]" />
    </>
  );
};

export default StarryBackground;
