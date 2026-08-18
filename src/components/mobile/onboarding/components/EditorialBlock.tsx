import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EditorialDivider } from "./EditorialDivider";

export const EditorialBlock = ({ title, subtitle, step }: { title: React.ReactNode, subtitle: string, step: number }) => (
  <div className="relative z-40 w-full px-6 flex flex-col items-center text-center shrink-0 h-[170px] justify-start pt-4 pointer-events-none">
    <AnimatePresence mode="wait">
      <motion.div
        key={`text-${step}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center w-full"
      >
        <h1 className="font-cinzel font-medium text-[24px] leading-[1.2] text-white tracking-wide uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] whitespace-pre-line max-w-[320px]">
          {title}
        </h1>
        <EditorialDivider />
        <p className="font-sans font-light text-[13px] text-white/70 leading-relaxed max-w-[280px]">
          {subtitle}
        </p>
      </motion.div>
    </AnimatePresence>
  </div>
);
