import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Tiny data-fetching hook with loading / success / empty / error states.
 * `fn` must return { data, source } (see src/api/services.js).
 */
export default function useAsync(fn, deps = []) {
  const [state, setState] = useState({ loading: true, error: null, data: null, source: null });
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    Promise.resolve()
      .then(() => fnRef.current())
      .then((res) => {
        if (cancelled) return;
        setState({ loading: false, error: null, data: res?.data ?? res, source: res?.source ?? null });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ loading: false, error, data: null, source: null });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  return { ...state, reload };
}
