const TEAMS = [
  { name: "Yashil", color: "#16A34A" },
  { name: "Ko'k", color: "#2563EB" },
  { name: "Sariq", color: "#CA8A04" },
  { name: "Qizil", color: "#DC2626" },
  { name: "Binafsha", color: "#7C3AED" },
  { name: "Pushti", color: "#DB2777" },
];

export const MAX_TEAMS = TEAMS.length;
export const AVATAR_COUNT = 11;

function shuffle(items, rng) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Each team draws from its own deck, so avatars stay unique within a team
// until the squad outgrows the number of available faces.
function dealer(rng) {
  let deck = [];
  return () => {
    if (deck.length === 0) {
      deck = shuffle(Array.from({ length: AVATAR_COUNT }, (_, i) => i + 1), rng);
    }
    return deck.pop();
  };
}

export function divideTeams(players, teamCount, rng = Math.random) {
  if (!Number.isInteger(teamCount) || teamCount < 2 || teamCount > MAX_TEAMS) {
    throw new Error(`Jamoalar soni 2 dan ${MAX_TEAMS} gacha bo'lishi kerak`);
  }
  if (players.length < teamCount) {
    throw new Error("O'yinchilar soni jamoalar sonidan kam");
  }
  const teams = Array.from({ length: teamCount }, (_, i) => ({
    id: i,
    name: TEAMS[i].name,
    color: TEAMS[i].color,
    players: [],
  }));
  const decks = teams.map(() => dealer(rng));
  shuffle(players, rng).forEach((name, i) => {
    const t = i % teamCount;
    teams[t].players.push({ name, avatar: decks[t]() });
  });
  return teams;
}

const SHAPES = {
  1: [1], 2: [1, 1], 3: [1, 2], 4: [1, 2, 1],
  5: [1, 2, 2], 6: [1, 2, 3], 7: [1, 3, 3], 8: [1, 3, 4],
};

// Rows run back to front: one keeper, then the outfield split across three
// lines with any remainder pushed to the rows nearest the goal they attack.
export function formation(n) {
  if (SHAPES[n]) return SHAPES[n].slice();
  const rest = n - 1;
  const base = Math.floor(rest / 3);
  const extra = rest % 3;
  return [1, ...[0, 1, 2].map((i) => base + (i >= 3 - extra ? 1 : 0))];
}
