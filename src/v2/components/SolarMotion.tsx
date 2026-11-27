import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Brand Motion Identity (Protocolo Solar — Premium Editorial Archetype):
 * - Signature Easing: power3.out (smooth luxury deceleration, 0% childish overshoot)
 * - Durations: quick 0.24s · standard 0.52s · slow 0.72s
 * - Official gsap-react pattern: gsap.context() scoped to containerRef + ctx.revert() cleanup
 * - Full prefers-reduced-motion compliance via gsap.matchMedia()
 */
export function useSolarScrollReveal(containerRef: RefObject<HTMLElement | null>, deps: any[] = []) {
  useEffect(() => {
    const scope = containerRef.current;
    if (!scope) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heroItems = gsap.utils.toArray<HTMLElement>(".solar-hero-in");
        if (heroItems.length > 0) {
          gsap.fromTo(
            heroItems,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.56,
              stagger: 0.08,
              ease: "power3.out",
              clearProps: "transform"
            }
          );
        }

        const revealItems = gsap.utils.toArray<HTMLElement>(".solar-reveal");
        revealItems.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.58,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true
              }
            }
          );
        });
      });
    }, scope);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * 3-Layer Payment / Action Confirmation Animation (LottieFiles Motion Design Skill):
 * - Primary: orbital ring draw + crisp checkmark stroke draw
 * - Secondary: warm golden halo expansion
 * - Ambient: 6 fine celestial sparkles settling softly
 */
export function SolarSuccessCheck({
  title = "Confirmado com sucesso",
  subtitle
}: {
  title?: string;
  subtitle?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = wrapRef.current;
    if (!scope) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(".sc-halo", { scale: 0.65, opacity: 0 }, { scale: 1.15, opacity: 0.35, duration: 0.55 })
          .to(".sc-halo", { scale: 1, opacity: 0.16, duration: 0.45 }, "-=0.15")
          .fromTo(
            ".sc-ring",
            { strokeDashoffset: 188.5 },
            { strokeDashoffset: 0, duration: 0.52, ease: "power2.out" },
            0.04
          )
          .fromTo(
            ".sc-tick",
            { strokeDashoffset: 48 },
            { strokeDashoffset: 0, duration: 0.34, ease: "power2.out" },
            0.34
          )
          .fromTo(
            ".sc-spark",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 0.9, duration: 0.32, stagger: 0.04 },
            0.38
          )
          .to(".sc-spark", { opacity: 0.25, duration: 0.5 }, 0.68)
          .fromTo(".sc-copy", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.42);
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  const sparkles = [
    { cx: 40, cy: 5 },
    { cx: 70, cy: 18 },
    { cx: 74, cy: 52 },
    { cx: 40, cy: 75 },
    { cx: 6, cy: 52 },
    { cx: 10, cy: 18 }
  ];

  return (
    <div ref={wrapRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10, padding: "10px 0" }}>
      <div style={{ position: "relative", width: 80, height: 80, display: "grid", placeItems: "center" }}>
        <div
          className="sc-halo"
          style={{
            position: "absolute",
            inset: 4,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,162,39,0.55) 0%, rgba(201,162,39,0) 70%)"
          }}
        />
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
          {sparkles.map((sp, i) => (
            <circle key={i} className="sc-spark" cx={sp.cx} cy={sp.cy} r="2.2" fill="#C9A227" />
          ))}
          <circle
            className="sc-ring"
            cx="40"
            cy="40"
            r="30"
            stroke="#15803D"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="188.5"
            transform="rotate(-90 40 40)"
          />
          <path
            className="sc-tick"
            d="M27 41.5 L36.2 50.5 L54 31.5"
            stroke="#15803D"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="48"
          />
        </svg>
      </div>
      <div className="sc-copy">
        <div style={{ fontSize: 18, fontWeight: 800, color: "#15803D", marginBottom: subtitle ? 4 : 0 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13.5, color: "#384357" }}>{subtitle}</div>}
      </div>
    </div>
  );
}

/**
 * Calm Luxury Orbital Loader (for Pix generation & Swiss Ephemeris calculation)
 */
export function SolarLoadingOrb({ label = "Calculando..." }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = ref.current;
    if (!scope) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".orb-outer", { rotation: 360, duration: 6, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
        gsap.to(".orb-inner", { rotation: -360, duration: 4, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
        gsap.to(".orb-core", { scale: 1.14, opacity: 0.9, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "50% 50%" });
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg width="26" height="26" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle className="orb-outer" cx="18" cy="18" r="15" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.6" strokeDasharray="18 10" />
        <circle className="orb-inner" cx="18" cy="18" r="10" stroke="#F5D993" strokeWidth="1.6" strokeDasharray="14 8" />
        <circle className="orb-core" cx="18" cy="18" r="3.6" fill="#F5D993" />
      </svg>
      <span>{label}</span>
    </div>
  );
}
