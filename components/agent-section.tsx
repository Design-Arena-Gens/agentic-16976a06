import clsx from "clsx";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AgentSectionProps = {
  title: string;
  subtitle: string;
  tone?: "idea" | "script" | "visual" | "distribution";
  children: ReactNode;
};

const toneMap: Record<NonNullable<AgentSectionProps["tone"]>, string> = {
  idea: "bg-gradient-to-br from-brand/20 via-brand-accent/10 to-transparent",
  script: "bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent",
  visual: "bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent",
  distribution: "bg-gradient-to-br from-emerald-500/20 via-lime-500/10 to-transparent"
};

export function AgentSection({ title, subtitle, tone = "idea", children }: AgentSectionProps) {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        "rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur",
        toneMap[tone],
        "shadow-lg shadow-brand/10"
      )}
    >
      <header className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white/70" aria-hidden />
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Agent Output</p>
        </div>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="max-w-2xl text-sm text-white/70">{subtitle}</p>
      </header>
      <div className="space-y-4 text-sm text-white/90">{children}</div>
    </motion.section>
  );
}
