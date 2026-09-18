import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { TERMS_TEXT } from "@/constants/legal";

export default function Terms() {
  return (
    <div className="min-h-[100dvh] bg-[#030306] text-white selection:bg-white/20 selection:text-black">
      <header className="sticky top-0 z-50 bg-[#030306]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link to="/auth" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="font-ps-display text-xl tracking-wide">Termos de Uso</h1>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="whitespace-pre-wrap font-ps-ui text-white/70 leading-relaxed text-sm md:text-base"
        >
          {TERMS_TEXT}
        </motion.div>
      </main>
    </div>
  );
}
