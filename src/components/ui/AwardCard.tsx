import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { popIn } from '../../lib/animations';

export function AwardCard({
  title,
  teamName,
  caption,
  color = '#38BDF8'
}: {
  title: string;
  teamName: string;
  caption: string;
  color?: string;
}) {
  return (
    <motion.div
      variants={popIn}
      initial="hidden"
      animate="visible"
      className="rounded-lg border border-white/15 bg-white/8 p-5"
    >
      <div className="flex items-center gap-3 text-2xl font-black text-white">
        <Award className="h-8 w-8" style={{ color }} />
        {title}
      </div>
      <div className="mt-3 text-4xl font-black text-white">{teamName}</div>
      <div className="mt-2 text-lg font-bold text-slate-300">{caption}</div>
    </motion.div>
  );
}
