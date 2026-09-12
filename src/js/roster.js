import { MAX_TEAMS } from "./split.js";

// Entry screen: the chip list, the team-count selector and the live readout.
// Owns no persistence — it reports changes upward through onChange.
export function createRoster({ root, onChange, onSubmit }) {
  const form = root.querySelector("#add-form");
  const input = root.querySelector("#name-input");
  const list = root.querySelector("#players");
  const hint = root.querySelector("#empty-hint");
  const counter = root.querySelector("#team-count");
  const readout = root.querySelector("#readout");
  const drawBtn = root.querySelector("#draw");
  const clearBtn = root.querySelector("#clear");

  // Names may legitimately repeat — two players really can both be Aziz — so
  // each entry carries an id and chips are keyed by it, never by the name.
  let entries = [];
  let teamCount = 2;
  let nextId = 1;

  for (let n = 2; n <= MAX_TEAMS; n++) {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.count = String(n);
    b.textContent = String(n);
    b.className =
      "w-11 border-r border-white/20 py-2 text-sm font-bold transition last:border-r-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-400/60";
    b.addEventListener("click", () => {
      teamCount = n;
      render();
      emit();
    });
    counter.append(b);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addName(input.value);
    input.value = "";
    input.focus();
  });

  input.addEventListener("keydown", (e) => {
    // Handle Enter explicitly rather than leaning on implicit form submission,
    // which varies across mobile keyboards and IME composition states.
    if (e.key === "Enter" && !e.isComposing) {
      e.preventDefault();
      addName(input.value);
      input.value = "";
      return;
    }
    // Backspace on an empty field removes the last chip, as tag inputs do.
    if (e.key === "Backspace" && input.value === "" && entries.length) {
      entries.pop();
      render();
      emit();
    }
  });

  list.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;
    entries = entries.filter((p) => p.id !== Number(btn.dataset.id));
    render();
    emit();
    input.focus();
  });

  clearBtn.addEventListener("click", () => {
    entries = [];
    render();
    emit();
    input.focus();
  });

  drawBtn.addEventListener("click", () => {
    if (entries.length >= teamCount) onSubmit();
  });

  function addName(raw) {
    const name = raw.trim().replace(/\s+/g, " ");
    if (!name) return;
    entries.push({ id: nextId++, name });
    render();
    emit();
  }

  function emit() {
    onChange({ players: entries.map((p) => p.name), teamCount });
  }

  function render() {
    list.textContent = "";
    for (const p of entries) {
      const chip = document.createElement("span");
      chip.role = "listitem";
      chip.className =
        "inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 py-1 pl-3 pr-1 text-sm text-white";

      // textContent, never innerHTML: a name containing quotes or < must stay literal.
      const label = document.createElement("span");
      label.textContent = p.name;

      const x = document.createElement("button");
      x.type = "button";
      x.dataset.id = String(p.id);
      x.className =
        "grid h-5 w-5 place-items-center rounded-full text-slate-400 transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40";
      x.textContent = "×";
      x.setAttribute("aria-label", `${p.name} — o'chirish`);

      chip.append(label, x);
      list.append(chip);
    }

    hint.hidden = entries.length > 0;

    for (const b of counter.children) {
      const on = Number(b.dataset.count) === teamCount;
      b.classList.toggle("bg-emerald-600", on);
      b.classList.toggle("text-white", on);
      b.classList.toggle("text-slate-300", !on);
      b.setAttribute("aria-pressed", String(on));
    }

    const n = entries.length;
    if (n === 0) {
      readout.textContent = "";
    } else if (n < teamCount) {
      readout.textContent = `${n} o'yinchi — ${teamCount} jamoa uchun kamida ${teamCount} ta kerak`;
    } else {
      const base = Math.floor(n / teamCount);
      const extra = n % teamCount;
      const sizes = Array.from({ length: teamCount }, (_, i) => base + (i < extra ? 1 : 0));
      readout.textContent = extra === 0
        ? `${n} o'yinchi → ${teamCount} jamoa × ${base} kishi`
        : `${n} o'yinchi → ${teamCount} jamoa · ${sizes.join("/")}`;
    }

    drawBtn.disabled = n < teamCount;
  }

  return {
    setState({ players, teamCount: tc }) {
      entries = players.map((name) => ({ id: nextId++, name }));
      teamCount = Math.min(Math.max(tc, 2), MAX_TEAMS);
      render();
    },
    focus() {
      input.focus();
    },
  };
}
