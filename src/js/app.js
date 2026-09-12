import { divideTeams } from "./split.js";
import { createStorage } from "./storage.js";
import { createRoster } from "./roster.js";
import { renderTeams } from "./teams.js";

const storage = createStorage();

const entry = document.querySelector("#entry");
const results = document.querySelector("#results");
const teamsEl = document.querySelector("#teams");
const title = document.querySelector("#results-title");

let state = storage.load();

const roster = createRoster({
  root: entry,
  onChange(next) {
    state = next;
    storage.save(state);
  },
  onSubmit: draw,
});

roster.setState(state);

function show(screen) {
  entry.classList.toggle("hidden", screen !== "entry");
  entry.classList.toggle("flex", screen === "entry");
  results.classList.toggle("hidden", screen !== "results");
  results.classList.toggle("flex", screen === "results");
}

function draw() {
  const teams = divideTeams(state.players, state.teamCount);
  title.textContent = `${state.players.length} o'yinchi · ${teams.length} jamoa`;
  renderTeams(teamsEl, teams);
  show("results");
  window.scrollTo({ top: 0 });
}

document.querySelector("#reshuffle").addEventListener("click", draw);

document.querySelector("#back").addEventListener("click", () => {
  show("entry");
  roster.focus();
});
