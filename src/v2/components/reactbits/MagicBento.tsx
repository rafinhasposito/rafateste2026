import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./MagicBento.css";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const THEMES = {
  dark: {
    "--mb-surface": "linear-gradient(180deg, #131929 0%, #0B101B 100%)",
    "--mb-edge": "rgba(245, 217, 147, 0.14)",
    "--mb-highlight": "rgba(255, 255, 255, 0.08)",
    "--mb-shadow": "0 24px 48px -28px rgba(0, 0, 0, 0.85)",
    "--mb-ink": "#FFF8E6",
    "--mb-muted": "rgba(255, 248, 230, 0.72)",
    "--mb-focus": "rgba(245, 217, 147, 0.55)",
    "--mb-glow-alpha": "0.85",
    "--mb-spot-alpha": "0.11"
  },
  light: {
    "--mb-surface": "linear-gradient(180deg, #FFFFFF 0%, #FAF6F0 100%)",
    "--mb-edge": "rgba(16, 22, 34, 0.09)",
    "--mb-highlight": "rgba(255, 255, 255, 1)",
    "--mb-shadow": "0 20px 44px -26px rgba(16, 22, 34, 0.2)",
    "--mb-ink": "#101622",
    "--mb-muted": "rgba(16, 22, 34, 0.68)",
    "--mb-focus": "rgba(16, 22, 34, 0.35)",
    "--mb-glow-alpha": "0.55",
    "--mb-spot-alpha": "0.06"
  }
};

const INK = { dark: [245, 217, 147], light: [16, 22, 34] };
const MIN_CELL = 150;
const MIN_PAIR = 200;
const STAGGER = 75;
const TILT = 6;
const MAGNET = 6;

const parseRgb = (value?: string): number[] | null => {
  if (!value) return null;
  const text = String(value).trim();
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (hex) {
    const full = hex[1].length === 3 ? hex[1].replace(/./g, (d) => d + d) : hex[1];
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  }
  const nums = text.match(/[\d.]+/g);
  return nums && nums.length >= 3 ? nums.slice(0, 3).map((c) => clamp(Math.round(parseFloat(c)), 0, 255)) : null;
};

export interface MagicBentoItem {
  id?: string | number;
  label?: string;
  title?: string;
  description?: string;
  icon?: ReactNode;
  image?: string;
  content?: ReactNode;
  href?: string;
  onClick?: () => void;
  colSpan?: number;
  rowSpan?: number;
}

export interface MagicBentoProps {
  items: MagicBentoItem[];
  columns?: number;
  rowHeight?: number;
  gap?: number;
  radius?: number;
  theme?: "dark" | "light";
  glowColor?: string;
  enableBorderGlow?: boolean;
  enableSpotlight?: boolean;
  spotlightRadius?: number;
  enableStars?: boolean;
  particleCount?: number;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  intro?: boolean;
  disableAnimations?: boolean;
  onItemClick?: (item: MagicBentoItem, index: number) => void;
  className?: string;
  style?: CSSProperties;
}

export default function MagicBento({
  items,
  columns = 4,
  rowHeight = 200,
  gap = 12,
  radius = 22,
  theme = "dark",
  glowColor = "#F5D993",
  enableBorderGlow = true,
  enableSpotlight = true,
  spotlightRadius = 300,
  enableStars = false,
  particleCount = 24,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  intro = true,
  disableAnimations = false,
  onItemClick,
  className = "",
  style
}: MagicBentoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const starRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [cols, setCols] = useState(Math.max(1, Math.round(columns)));

  const palette = theme === "light" ? "light" : "dark";
  const glow = parseRgb(glowColor) ?? INK[palette];

  const settingsRef = useRef({
    columns: Math.max(1, Math.round(columns)),
    gap: Math.max(0, gap),
    enableBorderGlow,
    enableSpotlight,
    spotlightRadius: Math.max(40, spotlightRadius),
    enableStars,
    particleCount: clamp(Math.round(particleCount), 0, 120),
    enableTilt,
    enableMagnetism,
    clickEffect,
    intro,
    disableAnimations,
    glow
  });
  settingsRef.current = {
    columns: Math.max(1, Math.round(columns)),
    gap: Math.max(0, gap),
    enableBorderGlow,
    enableSpotlight,
    spotlightRadius: Math.max(40, spotlightRadius),
    enableStars,
    particleCount: clamp(Math.round(particleCount), 0, 120),
    enableTilt,
    enableMagnetism,
    clickEffect,
    intro,
    disableAnimations,
    glow
  };

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const motion = !settingsRef.current.disableAnimations && !reduced;
    const playIntro = motion && settingsRef.current.intro;

    const pointer = { x: -1e5, y: -1e5, inside: false, down: -1 };
    const light = { x: -1e5, y: -1e5, near: 0, ready: false };
    const states: any[] = [];
    const wave = { x: 0, y: 0, t: -1, duration: 1.1, reach: 800 };
    let rects: (DOMRect | null)[] = [];
    let bounds: DOMRect | null = null;
    let dirty = true;
    let raf = 0;
    let last = 0;
    let visible = true;
    let entered = !playIntro;

    const stateFor = (i: number) => {
      if (!states[i]) states[i] = { hot: 0, rx: 0, ry: 0, tx: 0, ty: 0, vrx: 0, vry: 0, vtx: 0, vty: 0, press: 1, vpress: 0, written: {} };
      return states[i];
    };
    const write = (el: HTMLElement, st: any, k: string, v: string) => {
      if (st.written[k] === v) return;
      st.written[k] = v; el.style.setProperty(k, v);
    };
    const measure = () => {
      dirty = false;
      bounds = root.getBoundingClientRect();
      rects = cellRefs.current.map((c) => (c ? c.getBoundingClientRect() : null));
    };
    const startWave = (x: number, y: number, duration: number) => {
      if (!motion || !bounds) return;
      wave.x = x; wave.y = y; wave.t = 0; wave.duration = duration;
      wave.reach = Math.max(Math.hypot(x - bounds.left, y - bounds.top), Math.hypot(x - bounds.right, y - bounds.bottom)) + 160;
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      if (dirty) measure();
      const s = settingsRef.current;
      let busy = false;

      const margin = s.spotlightRadius * 0.5;
      const near = pointer.inside && bounds && pointer.x > bounds.left - margin && pointer.x < bounds.right + margin && pointer.y > bounds.top - margin && pointer.y < bounds.bottom + margin ? 1 : 0;
      if (!light.ready && near) { light.x = pointer.x; light.y = pointer.y; light.ready = true; }
      const follow = 1 - Math.exp(-dt / 0.05);
      light.x += (pointer.x - light.x) * follow;
      light.y += (pointer.y - light.y) * follow;
      light.near += (near - light.near) * (1 - Math.exp(-dt / (near > light.near ? 0.12 : 0.4)));
      if (Math.abs(near - light.near) > 0.002 || Math.abs(pointer.x - light.x) + Math.abs(pointer.y - light.y) > 0.3) busy = true;

      let waveR = 0, waveA = 0;
      if (wave.t >= 0) {
        wave.t += dt;
        const p = Math.min(1, wave.t / wave.duration);
        waveR = wave.reach * (1 - Math.pow(1 - p, 2.2));
        waveA = Math.pow(1 - p, 1.3);
        if (p >= 1) { wave.t = -1; waveA = 0; } else busy = true;
      }

      cardRefs.current.forEach((card, idx) => {
        const rect = rects[idx];
        if (!card || !rect) return;
        const st = stateFor(idx);
        const lx = light.x - rect.left, ly = light.y - rect.top;
        const px = pointer.x - rect.left, py = pointer.y - rect.top;
        const inside = pointer.inside && entered && px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;
        const hotT = inside && s.enableSpotlight ? 1 : 0;
        st.hot += (hotT - st.hot) * (1 - Math.exp(-dt / (hotT > st.hot ? 0.14 : 0.32)));
        if (Math.abs(hotT - st.hot) > 0.002) busy = true;

        const u = clamp(px / Math.max(1, rect.width), 0, 1) - 0.5;
        const v = clamp(py / Math.max(1, rect.height), 0, 1) - 0.5;
        const rxT = inside && s.enableTilt && motion ? -v * 2 * TILT : 0;
        const ryT = inside && s.enableTilt && motion ? u * 2 * TILT : 0;
        const txT = inside && s.enableMagnetism && motion ? u * 2 * MAGNET : 0;
        const tyT = inside && s.enableMagnetism && motion ? v * 2 * MAGNET : 0;
        st.rx += (rxT - st.rx) * 0.2; st.ry += (ryT - st.ry) * 0.2;
        st.tx += (txT - st.tx) * 0.2; st.ty += (tyT - st.ty) * 0.2;
        st.press += ((pointer.down === idx && s.clickEffect && motion ? 0.985 : 1) - st.press) * 0.25;

        write(card, st, "--mb-x", `${lx.toFixed(1)}px`);
        write(card, st, "--mb-y", `${ly.toFixed(1)}px`);
        write(card, st, "--mb-near", (s.enableBorderGlow ? light.near : 0).toFixed(3));
        write(card, st, "--mb-hot", st.hot.toFixed(3));
        write(card, st, "--mb-rx", `${st.rx.toFixed(2)}deg`);
        write(card, st, "--mb-ry", `${st.ry.toFixed(2)}deg`);
        write(card, st, "--mb-tx", `${st.tx.toFixed(1)}px`);
        write(card, st, "--mb-ty", `${st.ty.toFixed(1)}px`);
        write(card, st, "--mb-press", st.press.toFixed(4));
        write(card, st, "--mb-wx", `${(wave.x - rect.left).toFixed(1)}px`);
        write(card, st, "--mb-wy", `${(wave.y - rect.top).toFixed(1)}px`);
        write(card, st, "--mb-wr", `${waveR.toFixed(1)}px`);
        write(card, st, "--mb-wa", waveA.toFixed(3));
      });
      if (busy && visible) raf = requestAnimationFrame(frame);
    };

    const wake = () => { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const onMove = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.inside = true; wake(); };
    const onOut = (e: PointerEvent) => { if (!e.relatedTarget) { pointer.inside = false; pointer.down = -1; wake(); } };
    const onClick = (e: MouseEvent) => { if (settingsRef.current.clickEffect) { if (dirty) measure(); startWave(e.clientX, e.clientY, 1.0); wake(); } };
    const onScroll = () => { dirty = true; wake(); };

    const ro = new ResizeObserver(() => {
      const s = settingsRef.current;
      const w = root.clientWidth;
      const cell = (c: number) => (w - s.gap * (c - 1)) / c;
      setCols(cell(s.columns) >= MIN_CELL ? s.columns : s.columns >= 2 && cell(2) >= MIN_PAIR ? 2 : 1);
      dirty = true; wake();
    });
    ro.observe(root);

    const enter = () => {
      entered = true;
      cellRefs.current.forEach((c, i) => { if (c) { c.style.setProperty("--mb-delay", `${i * STAGGER}ms`); c.dataset.state = "in"; } });
      wake();
    };
    let gate: IntersectionObserver | null = null;
    if (playIntro && typeof IntersectionObserver !== "undefined") {
      gate = new IntersectionObserver((entries, obs) => { if (entries.some((e) => e.isIntersecting)) { obs.disconnect(); enter(); } }, { threshold: 0.15 });
      gate.observe(root);
    } else { enter(); }

    const vis = new IntersectionObserver((entries) => { visible = entries.some((e) => e.isIntersecting); if (visible) { dirty = true; wake(); } });
    vis.observe(root);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    document.addEventListener("pointerout", onOut);
    root.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); gate?.disconnect(); vis.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll, { capture: true });
      document.removeEventListener("pointerout", onOut);
      root.removeEventListener("click", onClick);
    };
  }, []);

  const span = Math.max(1, cols);
  cellRefs.current.length = items.length;
  cardRefs.current.length = items.length;
  starRefs.current.length = items.length;

  return (
    <div
      ref={rootRef}
      className={`magic-bento ${className}`.trim()}
      data-intro={intro && !disableAnimations ? "" : undefined}
      style={{
        ...(THEMES[palette] as CSSProperties),
        ["--mb-glow-rgb" as string]: glow.join(", "),
        ["--mb-radius" as string]: `${Math.max(0, radius)}px`,
        ["--mb-pad" as string]: `${Math.round(clamp(radius * 0.9, 16, 22))}px`,
        ["--mb-spot-size" as string]: `${Math.max(40, spotlightRadius)}px`,
        ["--mb-border-size" as string]: `${Math.round(Math.max(40, spotlightRadius) * 0.75)}px`,
        gridTemplateColumns: `repeat(${span}, minmax(0, 1fr))`,
        gridAutoRows: span === 1 ? `minmax(${rowHeight}px, auto)` : `${rowHeight}px`,
        gap: `${Math.max(0, gap)}px`,
        ...style
      }}
    >
      {items.map((item, idx) => {
        const clickable = Boolean(item.href || item.onClick || onItemClick);
        const onCardClick = () => { item.onClick?.(); onItemClick?.(item, idx); };
        return (
          <div
            key={item.id ?? idx}
            ref={(el) => { cellRefs.current[idx] = el; }}
            className="magic-bento__cell"
            style={{
              gridColumn: `span ${Math.min(span, Math.max(1, Math.round(item.colSpan ?? 1)))}`,
              gridRow: `span ${Math.max(1, Math.round(item.rowSpan ?? 1))}`
            }}
          >
            <div
              ref={(el) => { cardRefs.current[idx] = el; }}
              className="magic-bento__card"
              data-clickable={clickable ? "" : undefined}
              data-image={item.image ? "" : undefined}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={clickable ? onCardClick : undefined}
            >
              {item.image && <img className="magic-bento__image" src={item.image} alt="" draggable={false} />}
              {item.image && <span className="magic-bento__scrim" />}
              {enableSpotlight && <span className="magic-bento__light" />}
              <div className="magic-bento__content">
                {item.content ?? (
                  <>
                    {(item.icon || item.label) && (
                      <div className="magic-bento__header">
                        {item.icon && <span className="magic-bento__icon">{item.icon}</span>}
                        {item.label && <span>{item.label}</span>}
                      </div>
                    )}
                    <div className="magic-bento__text">
                      {item.title && <h3 className="magic-bento__title">{item.title}</h3>}
                      {item.description && <p className="magic-bento__description">{item.description}</p>}
                    </div>
                  </>
                )}
              </div>
              <span className="magic-bento__rim" />
              <span className="magic-bento__border" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
