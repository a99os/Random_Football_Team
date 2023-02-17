const form = document.querySelector(".form");
const input_wrapper = document.querySelector(".input_wrapper");
const buttons = document.querySelector(".buttons");
const clear = document.querySelector("#clear");

let count = 0;
const data = localStorage.getItem("football_random");
const players = data ? JSON.parse(data) : null;
let inputCount = 10;
if (players?.length > 10) inputCount = players.length;

for (let i = 0; i < inputCount; i++) {
  if (players) renderInput(players[i]);
  else renderInput();
}
function renderInput(name = "") {
  count++;
  const element = createElement(
    "div",
    "inputs",
    `
  <label for="input${count}" class="text-green-700 ">
  ${count}.
  <input
  value="${name}"
    placeholder="O'yinchi ismi"
    type="text"
    id="input${count}"
    class="inputs_inp rounded-lg w-[100px] md:w-auto bg-[#ffffff6d] placeholder:text-green-900 placeholder:opacity-60 p-2 outline-green-900 border border-spacing-1 border-white"
  />
</label>`
  );
  input_wrapper.append(element);
}

const addBtn = document.querySelector("#add");
const removeBtn = document.querySelector("#remove");

addBtn.addEventListener("click", (e) => {
  renderInput();
});

removeBtn.addEventListener("click", (e) => {
  const inp = document.querySelectorAll(".inputs");
  input_wrapper.removeChild(inp[inp.length - 1]);
  count--;
  const data = localStorage.getItem("football_random");
  const players = data ? JSON.parse(data) : null;
  if (players) {
    players.pop();
    localStorage.setItem("football_random", JSON.stringify(players));
  }
});

clear.addEventListener("click", () => {
  document.querySelectorAll(".inputs_inp").forEach((input) => {
    input.value = "";
  });
  localStorage.clear("football_random");
});
let posCount;
const width = window.innerWidth;

let positions = [
  "top-[220px] left-16",
  "top-[220px] right-16",
  "top-[60px] left-[160px]",
  "top-[60px] right-[160px]",
  "bottom-[60px] left-[160px]",
  "bottom-[60px] right-[160px]",
  "top-[60px] left-[330px]",
  "top-[60px] right-[330px]",
  "bottom-[60px] left-[330px]",
  "bottom-[60px] right-[330px]",
];
if (width < 500) {
  positions = [
    "top-[125px] left-10",
    "top-[125px] right-10",
    "top-[20px] left-[160px]",
    "top-[20px] right-[160px]",
    "bottom-[20px] left-[160px]",
    "bottom-[20px] right-[160px]",
    "top-[20px] left-[390px]",
    "top-[20px] right-[390px]",
    "bottom-[20px] left-[390px]",
    "bottom-[20px] right-[390px]",
  ];
}
const form_wrapper = document.querySelector(".form__wrapper");
const top__wrapper = document.querySelector(".top__wrapper");
const zamen_wrapper = document.querySelector(".zamen_wrapper");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formSubmit();
});
function formSubmit() {
  form_wrapper.classList.remove("flex");
  form_wrapper.classList.add("hidden");
  top__wrapper.classList.add("flex");
  top__wrapper.classList.remove("hidden");
  posCount = 0;
  const players = [];
  document.querySelectorAll(".inputs_inp").forEach((input) => {
    input.value ? players.push(input.value) : null;
  });
  localStorage.setItem("football_random", JSON.stringify(players));
  actionPlayers(players);
}

// ! random
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const stadium = document.querySelector(".stadium");
stadium.innerHTML = "";
function actionPlayers(players) {
  while (players.length) {
    let rand = Math.floor(Math.random() * players.length);
    if (posCount > 9) {
      posCount++;
      renderZamen(players[rand]);
    } else {
      renderPlayers(players[rand]);
    }
    players.splice(players.indexOf(players[rand]), 1);
  }
}
function renderPlayers(name = "") {
  const rr = nums.splice(Math.random() * nums.length, 1)[0];
  const element = createElement(
    "div",
    `absolute ${
      positions[posCount++]
    } bg-[#5da52ad3] max-w-[100px] -rotate-90 md:rotate-0 rounded-2xl p-2 text-center items-center flex justify-center flex-col`,
    `<h1 class="px-2 text-white inline-block text-xs md:text-lg py-1 rounded-lg">${name}</h1>
    <div
      class="w-10 h-14 md:w-16 md:h-24 bg-cover rounded-lg bg-center overflow-hidden bg-[url('./images/${rr}.png')]"
    ></div>
  `
  );

  setTimeout(() => {
    stadium.append(element);
  }, 2000 * posCount);
}
function renderZamen(name = "") {
  const element = createElement(
    "div",
    `bg-[#5da52ad3] rounded-2xl py-2 px-3 text-center items-center flex justify-center flex-col`,
    `<h1 class="px-1 md:px-2 text-xs text-white inline-block py-1 rounded-lg">${name}</h1>
    <div
    class="w-6 md:w-10 h-6 md:h-10 bg-cover rounded-lg bg-center overflow-hidden bg-[url('./images/11.png')]"
  ></div>
  `
  );

  setTimeout(() => {
    zamen_wrapper.append(element);
  }, 1000 * posCount);
}

const back = document.querySelector(".back");
const refresh = document.querySelector(".refresh");
back.addEventListener("click", () => {
  location.reload();
});
