import { useCallback, useState } from "react";

// Undo/redo state container. `set` records a new history entry (accepts a value
// or an updater fn). `reset` establishes a new baseline and clears history
// (use it for async loads that shouldn't be undoable).
export default function useHistory(initial) {
  const [hist, setHist] = useState({ past: [], present: initial, future: [] });

  const set = useCallback((updater) => {
    setHist((h) => {
      const next = typeof updater === "function" ? updater(h.present) : updater;
      if (next === h.present) return h;
      return { past: [...h.past, h.present], present: next, future: [] };
    });
  }, []);

  const reset = useCallback((value) => {
    setHist({ past: [], present: value, future: [] });
  }, []);

  const undo = useCallback(() => {
    setHist((h) => {
      if (!h.past.length) return h;
      const previous = h.past[h.past.length - 1];
      return {
        past: h.past.slice(0, -1),
        present: previous,
        future: [h.present, ...h.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHist((h) => {
      if (!h.future.length) return h;
      const next = h.future[0];
      return {
        past: [...h.past, h.present],
        present: next,
        future: h.future.slice(1),
      };
    });
  }, []);

  return {
    state: hist.present,
    set,
    reset,
    undo,
    redo,
    canUndo: hist.past.length > 0,
    canRedo: hist.future.length > 0,
  };
}
