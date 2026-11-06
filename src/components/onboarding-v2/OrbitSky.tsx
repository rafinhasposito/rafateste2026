import { useEffect, useRef } from "react";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const blend = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (a: number, b: number, value: number) => {
  const t = clamp((value - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function lightSprite(color: string) {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 64;
  const context = sprite.getContext("2d")!;
  const light = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  light.addColorStop(0, "#ffffff");
  light.addColorStop(.06, "#ffffff");
  light.addColorStop(.15, color);
  light.addColorStop(.38, color + "50");
  light.addColorStop(1, color + "00");
  context.fillStyle = light;
  context.fillRect(0, 0, 64, 64);
  return sprite;
}

export function OrbitSky({ playing, progress }: { playing: boolean; progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputs = useRef({ playing, progress });
  inputs.current = { playing, progress };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let seed = 19387;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(Math.max(random(), .00001))) * Math.cos(random() * Math.PI * 2);
    const stars = Array.from({ length: window.innerWidth < 1024 ? 5500 : 11000 }, (_, index) => {
      const radius = Math.pow(random(), .75);
      const house = index % 12;
      const edge = random();
      const wheelAngle = (house + (edge < .23 ? 0 : random())) * Math.PI / 6 - Math.PI / 2;
      const wheelRadius = (edge < .23 ? .692 + random() * .308 : edge < .60 ? 1 : edge < .9 ? .692 : .68 + random() * .34) + gaussian() * .008;
      return {
        radius,
        angle: (index % 2) * Math.PI + radius * 7.4 + gaussian() * (.15 + (1 - radius) * .26),
        height: gaussian() * .025 * (1.4 - radius),
        size: random() > .98 ? 12 + random() * 19 : 1.2 + Math.pow(random(), 3) * 11,
        opacity: .3 + random() * .65,
        color: random() > .78 ? 1 : 0,
        spreadX: (random() > .5 ? 1 : -1) * (.15 + random() * .85),
        spreadY: random() * 1.5 - .75,
        wheelX: Math.cos(wheelAngle) * wheelRadius,
        wheelY: Math.sin(wheelAngle) * wheelRadius,
        house,
      };
    });
    const background = Array.from({ length: 220 }, () => ({ x: random(), y: random(), size: .5 + random() * 3, opacity: .15 + random() * .5 }));
    const sprites = [lightSprite("#a8d5ff"), lightSprite("#ffc882")];
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let lastProgress = -1;
    let rotation = .24;

    const draw = () => {
      const p = inputs.current.progress;
      const separate = ease(.04, .36, p);
      const gather = ease(.33, .69, p);
      const focus = ease(.73, .95, p);
      const compact = width < 1024 && !(width >= 600 && height <= 520);
      const centerX = width * (compact ? .50 : .70);
      const centerY = height * (compact ? .305 : .47);
      const scale = Math.min(width * (compact ? .98 : .58), height * .93);
      // Match the SVG wheel's 500-unit viewBox and 224-unit outer radius.
      const wheelRadius = Math.min(width * (compact ? .88 : .48), height * (compact ? .45 : .72)) * .448;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";
      for (const star of background) {
        context.globalAlpha = star.opacity;
        context.drawImage(sprites[0], star.x * width, star.y * height, star.size, star.size);
      }
      for (const star of stars) {
        const orbit = star.angle + rotation;
        const x = Math.cos(orbit) * star.radius;
        const y = Math.sin(orbit) * star.radius;
        const projection = 1 / (1.9 - y * .34);
        const tiltedY = y * (.59 + separate * .22) + star.height;
        const galaxyX = centerX + (x * .57 - tiltedY * .82) * scale * projection;
        const galaxyY = centerY + (x * .82 + tiltedY * .57) * scale * projection;
        const spreadX = width / 2 + star.spreadX * width * .75;
        const spreadY = height / 2 + star.spreadY * height;
        const px = blend(blend(galaxyX, spreadX, separate), centerX + star.wheelX * wheelRadius, gather);
        const py = blend(blend(galaxyY, spreadY, separate), centerY + star.wheelY * wheelRadius, gather);
        const selected = star.house === 6;
        const size = star.size * blend(projection, .38, gather) * (compact ? .85 : 1);
        const opacity = star.opacity * (1 - gather * .2) * (selected ? 1 : 1 - focus * .72);
        const sprite = sprites[selected && focus > .25 ? 1 : star.color];
        if (size > 5) {
          const halo = size * 6;
          context.globalAlpha = opacity * .055;
          context.drawImage(sprite, px - halo / 2, py - halo / 2, halo, halo);
        }
        context.globalAlpha = opacity;
        context.drawImage(sprite, px - size / 2, py - size / 2, size, size);
      }
      const core = 1 - ease(.02, .30, p);
      if (core > 0) {
        const coreSize = scale * .24;
        context.globalAlpha = core * .65;
        context.drawImage(sprites[0], centerX - coreSize / 2, centerY - coreSize / 2, coreSize, coreSize);
      }
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      lastProgress = p;
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
        const drifting = inputs.current.playing && inputs.current.progress < .69;
        if (drifting) rotation += Math.min(elapsed, 80) * .000009;
        if (drifting || lastProgress !== inputs.current.progress) draw();
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
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return <canvas className="solar-orbit-sky" ref={canvasRef} aria-hidden="true" />;
}
