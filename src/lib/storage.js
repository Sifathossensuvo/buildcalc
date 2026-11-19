const P = 'buildcalc:';
export const store = {
  get(key, fallback) {
    try {
      const v = window.localStorage.getItem(P + key);
      return v === null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(P + key, JSON.stringify(value));
    } catch {
      /* storage unavailable (private mode / blocked) – ignore */
    }
  },
};
