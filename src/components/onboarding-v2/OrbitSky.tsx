import { useEffect, useRef } from "react";

type Star = {
  radius: number;
  angle: number;
  height: number;
  size: number;
  opacity: number;
  color: number;
};

function lightSprite(color: string) {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 64;
  const context = sprite.getContext("2d")!;
  const light = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  light.addColorStop(0, "#ffffff");
  light.addColorStop(0.06, "#ffffff");
  light.addColorStop(0.15, color);
  light.addColorStop(0.38, color + "50");
  light.addColorStop(1, color + "00");
  context.fillStyle = light;
  context.fillRect(0, 0, 64, 64);
  return sprite;
}

export function OrbitSky({ playing }: { playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotation = useRef(0);
  const playingRef = useRef(playing);
  useEffect(() => { playingRef.current = playing; }, [playing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let seed = 19387;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(Math.max(random(), 0.00001))) * Math.cos(random() * Math.PI * 2);
    const compact = window.innerWidth < 768;
    const stars: Star[] = Array.from({ length: compact ? 8000 : 16000 }, (_, index) => {
      const radius = Math.pow(random(), 0.75);
      const scatter = gaussian() * (0.15 + (1 - radius) * 0.26);
      return {
        radius,
        angle: (index % 2) * Math.PI + radius * 7.4 + scatter,
        height: gaussian() * 0.025 * (1.4 - radius),
        size: random() > 0.98 ? 12 + random() * 19 : 1.2 + Math.pow(random(), 3) * 12,
        opacity: 0.35 + random() * 0.65,
        color: random() > 0.78 ? 1 : 0,
      };
    });
    const background = Array.from({ length: compact ? 120 : 320 }, () => ({
      x: random(), y: random(), size: 0.5 + random() * 3, opacity: 0.15 + random() * 0.5,
    }));
    const sprites = [lightSprite("#a8d5ff"), lightSprite("#ffc48c")];
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let lastDrawnRotation = -1;

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";
      for (const star of background) {
        context.globalAlpha = star.opacity;
        context.drawImage(sprites[0], star.x * width, star.y * height, star.size, star.size);
      }
      const centerX = width * (compact ? 0.58 : 0.67);
      const centerY = height * (compact ? 0.30 : 0.46);
      const scale = Math.min(width * (compact ? 1.03 : 0.58), height * 0.93);
      const angle = rotation.current;
      for (const star of stars) {
        const orbit = star.angle + angle;
        const x = Math.cos(orbit) * star.radius;
        const y = Math.sin(orbit) * star.radius;
        const depth = y * 0.68;
        const projection = 1 / (1.9 - depth * 0.5);
        const tiltedY = y * 0.59 + star.height;
        const screenX = (x * 0.57 - tiltedY * 0.82) * scale * projection;
        const screenY = (x * 0.82 + tiltedY * 0.57) * scale * projection;
        const size = star.size * projection * (compact ? 0.85 : 1);
        if (star.size > 12) {
          const halo = size * 7;
          context.globalAlpha = 0.045;
          context.drawImage(sprites[star.color], centerX + screenX - halo / 2, centerY + screenY - halo / 2, halo, halo);
        }
        context.globalAlpha = star.opacity;
        context.drawImage(sprites[star.color], centerX + screenX - size / 2, centerY + screenY - size / 2, size, size);
      }
      // Soft unresolved starlight at the galactic center.
      context.globalAlpha = 0.8;
      const coreSize = scale * 0.28;
      context.drawImage(sprites[0], centerX - coreSize / 2, centerY - coreSize / 2, coreSize, coreSize);
      context.globalAlpha = 0.6;
      context.drawImage(sprites[1], centerX - coreSize / 4, centerY - coreSize / 4, coreSize / 2, coreSize / 2);
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      lastDrawnRotation = rotation.current;
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };
    const tick = (now: number) => {
      const elapsed = now - lastFrame;
      if (elapsed >= 33) {
        if (playingRef.current) rotation.current += Math.min(elapsed, 80) * 0.000025;
        if (lastDrawnRotation !== rotation.current) draw();
        lastFrame = now;
      }
      frame = requestAnimationFrame(tick);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return <canvas className="solar-orbit-sky" ref={canvasRef} aria-hidden="true" />;
}
