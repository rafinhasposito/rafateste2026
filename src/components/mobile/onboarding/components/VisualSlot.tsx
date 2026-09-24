import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const VisualSlot = ({ children, step, onDragEnd }: any) => (
  <motion.div
    key={`visual-slot`}
    drag="x"
    dragConstraints={{ left: 0, right: 0 }}
    dragElastic={0.1}
    onDragEnd={onDragEnd}
    className="flex-1 w-full flex items-center justify-center relative z-30 overflow-hidden"
  >
    <AnimatePresence mode="wait">
      <motion.div
        key={`content-${step}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full flex items-center justify-center"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  </motion.div>
);
