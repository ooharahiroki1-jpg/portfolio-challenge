import { motion } from 'framer-motion';
import { cardVariants } from '../../lib/animations';

interface MetricCardProps {
  label: string;
  value: string;
  accent?: 'blue' | 'green' | 'red' | 'orange' | 'white';
  caption?: string;
}

const accents = {
  blue: 'from-blue-500/24 to-sky-400/10 border-sky-300/30',
  green: 'from-rise-500/24 to-emerald-400/10 border-rise-500/35',
  red: 'from-fall-500/26 to-red-900/20 border-fall-500/40',
  orange: 'from-alert-500/24 to-amber-400/10 border-alert-500/40',
  white: 'from-white/14 to-white/5 border-white/20'
};

export function MetricCard({
  label,
  value,
  accent = 'blue',
  caption
}: MetricCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-lg border bg-gradient-to-br ${accents[accent]} p-5 shadow-glow`}
    >
      <div className="text-lg font-semibold text-slate-300">{label}</div>
      <div className="mt-2 text-5xl font-black tracking-normal text-white">{value}</div>
      {caption ? (
        <div className="mt-2 text-lg font-medium text-slate-300">{caption}</div>
      ) : null}
    </motion.div>
  );
}
