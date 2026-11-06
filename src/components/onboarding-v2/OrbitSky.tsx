import { useEffect, useRef } from "react";

// Spiral arms in a tilted orbital plane. Draw a single frame when motion is paused.
export function OrbitSky({ playing }: { playing: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const phase = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let seed = 90210;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const stars = Array.from({ length: 560 }, (_, i) => {
      const r = Math.pow(random(), 0.7);
      return { r, a: (i % 3) * Math.PI * 2 / 3 + r * 5.4 + (random() - 0.5) * 0.42,
        z: (random() - 0.5) * 0.085, light: random(), size: 0.4 + random() ** 3 * 2.1 };
    });
    let frame = 0;
    let last = 0;
    function draw() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const scale = Math.min(w * 0.51, h * 0.68);
      ctx.clearRect(0, 0, w, h);
      const glow = ctx.createRadialGradient(w / 2,h / 2,1,w / 2,h / 2,scale * 0.55);
      glow.addColorStop(0,"rgba(255,221,156,.36)");
      glow.addColorStop(.2,"rgba(193,139,74,.14)");
      glow.addColorStop(1,"rgba(193,139,74,0)");
      ctx.fillStyle = glow; ctx.fillRect(0,0,w,h);
      for (const s of stars) {
        const a = s.a + phase.current;
        const x = Math.cos(a) * s.r, y = Math.sin(a) * s.r * 0.48 + s.z;
        ctx.fillStyle = s.light > 0.55 ? "#ffe3af" : "#cedff1";
        ctx.globalAlpha = 0.4 + s.light * 0.6;
        ctx.beginPath(); ctx.arc(w/2 + (x*.94+y*.34)*scale,h/2+(y*.94-x*.34)*scale,s.size,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      ctx.setTransform(ratio,0,0,ratio,0,0); draw();
    };
    const tick = (now: number) => {
      if (now - last >= 32) {
        phase.current += Math.min(now-last, 50)*0.000085; draw(); last=now;
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      if (playing && !document.hidden) {last=performance.now(); frame=requestAnimationFrame(tick);}
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas); resize(); sync();
    document.addEventListener("visibilitychange",sync);
    return () => {observer.disconnect(); cancelAnimationFrame(frame); document.removeEventListener("visibilitychange",sync);};
  }, [playing]);
  return <canvas className="solar-orbit-sky" ref={ref} aria-hidden="true" />;
}
