import React from "react";

const StarryBackground = () => {
  return (
    <>
      {/* Void black base */}
      <div
        className="fixed inset-0 z-[-2]"
        style={{ background: "#030306" }}
      />
      {/* Subtle radial gold at top for depth */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(212,175,55,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Film grain for premium tactile feel */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />
    </>
  );
};

export default StarryBackground;
