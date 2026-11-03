import React from "react";

const StarryBackground = () => {
  return (
    <>
      {/* Unified Deep Cosmic Obsidian base (#02050A) */}
      <div
        className="fixed inset-0 z-[-2]"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 0%, #07101E 0%, #030710 55%, #02050A 100%)",
        }}
      />
      {/* Subtle radial gold at top for depth */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(201,162,39,0.08) 0%, transparent 70%)",
        }}
      />
    </>
  );
};

export default StarryBackground;
