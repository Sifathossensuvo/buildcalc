import { Moon, Sun } from 'lucide-react';
import { usePrefs } from '../context/Prefs.jsx';

export default function ThemeToggle() {
  const { theme, chooseTheme } = usePrefs();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => chooseTheme(dark ? 'light' : 'dark')}
      className="relative flex h-9 w-[68px] items-center rounded-full border border-slate-200 bg-slate-100 px-1.5 transition-colors dark:border-ink-line dark:bg-ink-soft"
    >
      <Sun className="absolute left-2 h-4 w-4 text-amber-500" aria-hidden="true" />
      <Moon className="absolute right-2 h-4 w-4 text-slate-400 dark:text-brand-400" aria-hidden="true" />
      <span className={`absolute top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow transition-all duration-200 dark:bg-brand-600 ${dark ? 'left-[36px]' : 'left-1'}`}>
        {dark ? <Moon className="h-4 w-4 text-white" aria-hidden="true" /> : <Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />}
      </span>
    </button>
  );
}
