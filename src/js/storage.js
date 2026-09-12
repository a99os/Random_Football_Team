export const KEY = "football_random";

const EMPTY = () => ({ players: [], teamCount: 2 });

const isName = (v) => typeof v === "string" && v.trim() !== "";

// The storage target is injected so the logic can be tested without a browser.
export function createStorage(target = globalThis.localStorage) {
  return {
    load() {
      let raw;
      try {
        raw = target?.getItem(KEY);
      } catch {
        return EMPTY();
      }
      if (!raw) return EMPTY();

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return EMPTY();
      }

      // The first version of the app stored a bare array of names.
      if (Array.isArray(parsed)) {
        return { players: parsed.filter(isName), teamCount: 2 };
      }
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.players)) {
        return {
          players: parsed.players.filter(isName),
          teamCount: Number.isInteger(parsed.teamCount) ? parsed.teamCount : 2,
        };
      }
      return EMPTY();
    },

    save({ players, teamCount }) {
      try {
        target?.setItem(KEY, JSON.stringify({ players, teamCount }));
      } catch {
        // Private browsing and full quotas both throw; losing the roster is not fatal.
      }
    },

    // Never localStorage.clear() — that wipes every key on the origin, not just ours.
    clear() {
      try {
        target?.removeItem(KEY);
      } catch {
        /* nothing we can do */
      }
    },
  };
}
