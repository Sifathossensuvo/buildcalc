import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { store } from '../lib/storage.js';
import { CURRENCIES } from '../lib/units.js';

const Ctx = createContext(null);
export const usePrefs = () => useContext(Ctx);

function initialTheme() {
  const saved = store.get('theme', null);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function PrefsProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);
  const [favorites, setFavorites] = useState(() => store.get('favorites', []));
  const [recents, setRecents] = useState(() => store.get('recents', []));
  const [units, setUnitsState] = useState(() => (store.get('units', 'metric') === 'imperial' ? 'imperial' : 'metric'));
  const [currency, setCurrencyState] = useState(() => store.get('currency', 'USD'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const chooseTheme = useCallback((t) => { setTheme(t); store.set('theme', t); }, []);
  const toggleFav = useCallback((slug) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev];
      store.set('favorites', next);
      return next;
    });
  }, []);
  const pushRecent = useCallback((slug) => {
    setRecents((prev) => {
      if (prev[0] === slug) return prev;
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, 8);
      store.set('recents', next);
      return next;
    });
  }, []);
  const setUnits = useCallback((u) => { setUnitsState(u); store.set('units', u); }, []);
  const setCurrency = useCallback((c) => { setCurrencyState(c); store.set('currency', c); }, []);

  const value = useMemo(
    () => ({
      theme, chooseTheme, favorites, toggleFav, recents, pushRecent, units, setUnits, currency, setCurrency,
      currencySym: (CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0]).sym,
    }),
    [theme, chooseTheme, favorites, toggleFav, recents, pushRecent, units, setUnits, currency, setCurrency]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
