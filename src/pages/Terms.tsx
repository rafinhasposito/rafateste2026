import { motion } from "framer-motion";
import { TERMS_TEXT } from "@/constants/legal";

export default function Terms() {
  return (
    <div className="min-h-[100dvh] text-white selection:bg-[#C9A227]/30">
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <h1 className="font-ps-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6 pb-4 border-b border-white/10">
          Termos de Uso
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="whitespace-pre-wrap font-ps-ui text-white/75 leading-relaxed text-sm md:text-base"
        >
          {TERMS_TEXT}
        </motion.div>
      </main>
    </div>
  );
}
