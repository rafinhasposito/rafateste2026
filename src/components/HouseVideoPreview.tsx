import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface HouseVideoPreviewProps {
  houseId: number;
  className?: string;
  overlayClassName?: string;
}

export function getHouseVideoAssets(houseId: number) {
  const safeId = houseId >= 1 && houseId <= 12 ? houseId : 1;
  const padded = String(safeId).padStart(2, "0");
  return {
    videoSrc: `/videos/houses/casa-${padded}.mp4`,
    posterSrc: `/videos/houses/casa-${padded}-poster.jpg`,
    storyFallback: `/images/stories/casa-${safeId}.jpg`,
  };
}

export function HouseVideoPreview({
  houseId,
  className = "w-full h-full object-cover",
  overlayClassName,
}: HouseVideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { videoSrc, posterSrc } = getHouseVideoAssets(houseId);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void el.play().catch(() => {
              // Silent fallback to poster when battery saver blocks autoplay
            });
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.15, rootMargin: "120px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [houseId, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={posterSrc}
          alt={`Casa ${String(houseId).padStart(2, "0")}`}
          loading="lazy"
          className={className}
        />
        {overlayClassName && <div className={overlayClassName} />}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        poster={posterSrc}
        muted
        loop
        playsInline
        preload="metadata"
        className={className}
      />
      {overlayClassName && <div className={overlayClassName} />}
    </div>
  );
}
