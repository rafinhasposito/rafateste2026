import { useEffect, useRef, useState } from "react";

export function getHouseVideoAssets(houseId: number): {
  videoSrc: string;
  posterSrc: string;
} {
  const safeId = houseId >= 1 && houseId <= 12 ? houseId : 1;
  const padded = String(safeId).padStart(2, "0");
  return {
    videoSrc: `/videos/v3/casa-${padded}-v3.mp4`,
    posterSrc: `/videos/v3/casa-${padded}-v3-poster.jpg`,
  };
}

interface HouseVideoPreviewProps {
  houseId: number;
  className?: string;
  overlayClassName?: string;
}

export function HouseVideoPreview({
  houseId,
  className = "w-full h-full object-cover",
  overlayClassName,
}: HouseVideoPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);

  const { videoSrc, posterSrc } = getHouseVideoAssets(houseId);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        }
      },
      { rootMargin: "220px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#060911]">
      <video
        ref={videoRef}
        src={inView ? videoSrc : undefined}
        poster={posterSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className={className}
      />
      {overlayClassName ? <div className={overlayClassName} /> : null}
    </div>
  );
}

export default HouseVideoPreview;
