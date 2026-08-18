import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EditorialDivider } from "./EditorialDivider";

interface EditorialBlockProps {
  title: React.ReactNode;
  subtitle: string;
  step: number;
}

export const EditorialBlock = ({ title, subtitle, step }: EditorialBlockProps) => (
  <div className="relative z-40 w-full px-6 flex flex-col items-center text-center shrink-0 min-h-[145px] justify-start pt-2 pointer-events-none">
    <AnimatePresence mode="wait">
      <motion.div
        key={`editorial-${step}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col items-center w-full max-w-[340px]"
      >
        <h1 className="font-cinzel font-medium text-[21px] md:text-[23px] leading-[1.25] tracking-[0.05em] uppercase text-[#FAF7EE] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] whitespace-pre-line">
          {title}
        </h1>
        
        <EditorialDivider />

        <p className="font-sans font-light text-[12px] md:text-[13px] text-[#FAF7EE]/75 leading-relaxed max-w-[300px]">
          {subtitle}
        </p>
      </motion.div>
    </AnimatePresence>
  </div>
);
