// DOM elements
let pokemonForm = document.getElementById("pokemon-form");
let pokemonCountInput = document.getElementById("pokemon-count");
let divPokedex = document.getElementById("pokedex");
const temp = document.getElementById("template");
let fightButton = document.getElementById("start-fight");

// Pokemon and Move constructors
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

// Global variables
const pokedex = [];
const selectedPokemons = [];

// Event listeners

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  renderPokedex();
  selectedPokemons.length = 0;
});

// Form submission to update Pokémon count
pokemonForm.addEventListener("submit", (e) => {
  e.preventDefault();
  renderPokedex();
  selectedPokemons.length = 0;
});

// Fight button click
fightButton.addEventListener("click", () => {
  if (selectedPokemons.length === 2) {
    let pokemon1 = selectedPokemons[0];
    let pokemon2 = selectedPokemons[1];
    sessionStorage.setItem("pokemon1", JSON.stringify(pokemon1));
    sessionStorage.setItem("pokemon2", JSON.stringify(pokemon2));
    window.location.href = "fight.html";
  }
});

// Functions

// Render pokedex based on user input
async function renderPokedex() {
  let count = parseInt(pokemonCountInput.value);
  const randomIds = getRandomIds(count); // Get unique random IDs
  clearPokedex();
  await Promise.all(randomIds.map((id) => addPokemon(id))); // Fetch and add Pokémon concurrently
  pokedex.forEach((pokemon) => {
    divPokedex.appendChild(cloneTemplate(pokemon)); // Clone and append template
  });
}

// Generate unique random Pokémon IDs
function getRandomIds(count) {
  const ids = new Set(); // Use a Set to ensure uniqueness
  while (ids.size < count) {
    const randomId = Math.floor(Math.random() * 1025) + 1; // Pokémon IDs range from 1 to 1025
    ids.add(randomId);
  }
  return Array.from(ids);
}

// Clear the pokedex display and reset the pokedex array
function clearPokedex() {
  divPokedex.innerHTML = "";
  pokedex.length = 0;
}

// Fetch and add a Pokémon to the pokedex
async function addPokemon(id) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`); // Fetch Pokémon data
  let responseData = await response.json(); // Parse JSON response
  // Create and add new Pokémon to the pokedex
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
      await getMoves(responseData.moves) // Fetch and assign moves
    )
  );
}

// Clone the template and populate it with Pokémon data
function cloneTemplate(pokemon) {
  const clonedTemplate = temp.content.cloneNode(true); // Deep clone

  const flip = clonedTemplate.querySelector(".pokemon-card-flip"); // Flip container
  const frontCard = clonedTemplate.querySelector(".pokemon-card.front"); // Front side
  const backCard = clonedTemplate.querySelector(".pokemon-card.backside"); // Back side

  // Set front card attributes and styles
  frontCard.setAttribute("id", `card-${pokemon.id}`);
  frontCard.style.backgroundImage = `var(--type-${pokemon.types[0]}-color)`;

  // Populate front card with Pokémon data
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
  // Set up moves button on back card
  clonedTemplate
    .querySelector(".pokemon-moves-button")
    .addEventListener("click", () => {
      // Display moves in an alert
      alert(
        pokemon.moves
          .map(
            (m) =>
              `${m.name} (Type: ${m.type}, Power: ${m.power}, Accuracy: ${m.accuracy})`
          )
          .join("\n")
      );
    });

  // Set up select button on card
  let selectButton = clonedTemplate.querySelector(".pokemon-select-button");
  selectButton.setAttribute("id", `select-${pokemon.id}`);

  // Select/Deselect functionality
  selectButton.addEventListener("click", () => {
    frontCard.classList.toggle("selected"); // Toggle selected class

    // Handle selection logic
    if (selectedPokemons.includes(pokemon)) {
      selectedPokemons.splice(selectedPokemons.indexOf(pokemon), 1); // Deselect
      selectButton.textContent = "Select"; // Update button text

      flip.classList.remove("is-flipped"); // Flip back to front

      fightButton.style.display = "none";
    } else {
      selectedPokemons.push(pokemon); // Select
      selectButton.textContent = "Deselect"; // Update button text

      flip.classList.add("is-flipped"); // Flip to back

      // Ensure only two Pokémon are selected
      if (selectedPokemons.length > 2) {
        removedPokemon = selectedPokemons.shift(); // Remove the first selected Pokémon

        document
          .getElementById(`card-${removedPokemon.id}`)
          .classList.remove("selected"); // Deselect visually

        document.getElementById(`select-${removedPokemon.id}`).innerText =
          "Select"; // Update button text

        document
          .getElementById(`card-${removedPokemon.id}`)
          .closest(".pokemon-card-flip")
          .classList.remove("is-flipped"); // Flip back to front
      }
      fightButton.style.display =
        selectedPokemons.length === 2 ? "block" : "none"; // Show fight button if two selected
    }
  });

  return clonedTemplate;
}

// Fetch and return up to 4 valid moves for a Pokémon
async function getMoves(movesArray) {
  const shuffled = movesArray.slice().sort(() => Math.random() - 0.5); // Shuffle moves
  const result = [];

  // Fetch move details and filter valid moves
  for (const m of shuffled) {
    if (result.length === 4) break; // Limit to 4 moves
    const res = await fetch(m.move.url); // Fetch move data
    const moveData = await res.json(); // Parse JSON

    // Only include moves with power and accuracy
    if (!moveData.power || !moveData.accuracy) {
      continue;
    }

    // Create and add new Move to the result array
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
