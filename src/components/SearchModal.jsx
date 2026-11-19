import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox.jsx';
import { calcPath } from '../data/calculators.js';

export default function SearchModal({ onClose }) {
  const nav = useNavigate();
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search calculators">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.18 }} className="relative w-full max-w-xl">
        <SearchBox autoFocus listAlways large onPick={(c) => { onClose(); nav(calcPath(c.slug)); }} />
        <p className="mt-3 text-center text-xs text-slate-200">Use ↑ ↓ to move, Enter to open, Esc to close</p>
      </motion.div>
    </div>
  );
}
