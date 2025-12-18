let pokemonForm = document.getElementById("pokemon-form");
let pokemonCountInput = document.getElementById("pokemon-count");
let divPokedex = document.getElementById("pokedex");
const temp = document.getElementById("template");
let fightButton = document.getElementById("start-fight");

const Pokemon = function (
  id,
  name,
  types,
  sprite,
  attack,
  defense,
  hp,
  speed,
  moves
) {
  this.id = id;
  this.name = name;
  this.types = types;
  this.sprite = sprite;
  this.attack = attack;
  this.defense = defense;
  this.hp = hp;
  this.speed = speed;
  this.moves = moves;
};
const Move = function (id, name, accuracy, power, type) {
  this.id = id;
  this.name = name;
  this.type = type;
  this.power = power;
  this.accuracy = accuracy;
};
const pokedex = [];
const selectedPokemons = [];

document.addEventListener("DOMContentLoaded", () => {
  renderPokedex();
  selectedPokemons.length = 0;
});

pokemonForm.addEventListener("submit", (e) => {
  e.preventDefault();
  renderPokedex();
  selectedPokemons.length = 0;
});

fightButton.addEventListener("click", () => {
  if (selectedPokemons.length === 2) {
    let pokemon1 = selectedPokemons[0];
    let pokemon2 = selectedPokemons[1];
    sessionStorage.setItem("pokemon1", JSON.stringify(pokemon1));
    sessionStorage.setItem("pokemon2", JSON.stringify(pokemon2));
    window.location.href = "fight.html";
  }
});

async function renderPokedex() {
  let count = parseInt(pokemonCountInput.value);
  const randomIds = getRandomIds(count);
  clearPokedex();
  await Promise.all(randomIds.map((id) => addPokemon(id)));
  console.log(pokedex);
  pokedex.forEach((pokemon) => {
    divPokedex.appendChild(cloneTemplate(pokemon));
  });
}

function getRandomIds(count) {
  const ids = new Set();
  while (ids.size < count) {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    ids.add(randomId);
  }
  return Array.from(ids);
}

function clearPokedex() {
  divPokedex.innerHTML = "";
  pokedex.length = 0;
}

async function addPokemon(id) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  let responseData = await response.json();
  pokedex.push(
    new Pokemon(
      responseData.id,
      responseData.name.charAt(0).toUpperCase() + responseData.name.slice(1),
      responseData.types.map((t) => t.type.name),
      responseData.sprites.front_default,
      responseData.stats.find((s) => s.stat.name === "attack").base_stat,
      responseData.stats.find((s) => s.stat.name === "defense").base_stat,
      responseData.stats.find((s) => s.stat.name === "hp").base_stat,
      responseData.stats.find((s) => s.stat.name === "speed").base_stat,
      await getMoves(responseData.moves)
    )
  );
}

function cloneTemplate(pokemon) {
  const clonedTemplate = temp.content.cloneNode(true);

  const flip = clonedTemplate.querySelector(".pokemon-card-flip");
  const frontCard = clonedTemplate.querySelector(".pokemon-card.front");
  const backCard = clonedTemplate.querySelector(".pokemon-card.backside");

  frontCard.setAttribute("id", `card-${pokemon.id}`);
  frontCard.style.backgroundImage = `var(--type-${pokemon.types[0]}-color)`;

  clonedTemplate.querySelector(".pokemon-name").textContent = pokemon.name;
  clonedTemplate.querySelector(".pokemon-hp").textContent = `${pokemon.hp} HP`;
  clonedTemplate
    .querySelector(".pokemon-image")
    .setAttribute("src", pokemon.sprite);
  clonedTemplate
    .querySelector(".pokemon-image")
    .setAttribute("alt", pokemon.name);
  clonedTemplate.querySelector(
    ".pokemon-types"
  ).textContent = `Type(s): ${pokemon.types.join(", ")}`;
  clonedTemplate.querySelector(
    ".pokemon-attack"
  ).textContent = `Attack: ${pokemon.attack}`;
  clonedTemplate.querySelector(
    ".pokemon-defense"
  ).textContent = `Defense: ${pokemon.defense}`;
  clonedTemplate.querySelector(
    ".pokemon-speed"
  ).textContent = `Speed: ${pokemon.speed}`;
  clonedTemplate
    .querySelector(".pokemon-moves-button")
    .addEventListener("click", () => {
      alert(
        pokemon.moves
          .map(
            (m) =>
              `${m.name} (Type: ${m.type}, Power: ${m.power}, Accuracy: ${m.accuracy})`
          )
          .join("\n")
      );
    });

  let selectButton = clonedTemplate.querySelector(".pokemon-select-button");
  selectButton.setAttribute("id", `select-${pokemon.id}`);

  selectButton.addEventListener("click", () => {
    frontCard.classList.toggle("selected");

    if (selectedPokemons.includes(pokemon)) {
      selectedPokemons.splice(selectedPokemons.indexOf(pokemon), 1);
      selectButton.textContent = "Select";

      flip.classList.remove("is-flipped");

      fightButton.style.display = "none";
    } else {
      selectedPokemons.push(pokemon);
      selectButton.textContent = "Deselect";

      flip.classList.add("is-flipped");

      if (selectedPokemons.length > 2) {
        removedPokemon = selectedPokemons.shift();

        document
          .getElementById(`card-${removedPokemon.id}`)
          .classList.remove("selected");

        document.getElementById(`select-${removedPokemon.id}`).innerText =
          "Select";

        document.getElementById(`card-${removedPokemon.id}`).closest(".pokemon-card-flip").classList.remove("is-flipped");
      }
      fightButton.style.display =
        selectedPokemons.length === 2 ? "block" : "none";
    }
  });
  
  return clonedTemplate;
}

async function getMoves(movesArray) {
  const shuffled = movesArray.slice().sort(() => Math.random() - 0.5);
  const result = [];

  for (const m of shuffled) {
    if (result.length === 4) break;
    const res = await fetch(m.move.url);
    const moveData = await res.json();

    if (!moveData.power || !moveData.accuracy) {
      continue;
    }

    result.push(
      new Move(
        moveData.id,
        moveData.name,
        moveData.accuracy,
        moveData.power,
        moveData.type.name
      )
    );
  }

  return result;
}
