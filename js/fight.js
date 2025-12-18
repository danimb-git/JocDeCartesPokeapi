// DOM elements
const fightDiv = document.getElementById("fight");
const temp = document.getElementById("template");

// Pokemon constructor
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
  this.hpElement = null;
};

// Global variables
const pokedex = [];
const typeChart = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  electric: {
    water: 2,
    grass: 0.5,
    electric: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    ice: 0.5,
    ground: 2,
    flying: 2,
    grass: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    rock: 2,
    dark: 2,
    steel: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    fairy: 0.5,
    ghost: 0,
  },
  poison: {
    grass: 2,
    fairy: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
  },
  ground: {
    fire: 2,
    electric: 2,
    poison: 2,
    rock: 2,
    steel: 2,
    grass: 0.5,
    bug: 0.5,
    flying: 0,
  },
  flying: {
    fighting: 2,
    bug: 2,
    grass: 2,
    rock: 0.5,
    electric: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: {
    grass: 2,
    psychic: 2,
    dark: 2,
    fire: 0.5,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    ghost: 0.5,
    steel: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    flying: 2,
    bug: 2,
    fighting: 0.5,
    ground: 0.5,
    steel: 0.5,
  },
  ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
  steel: {
    ice: 2,
    rock: 2,
    fairy: 2,
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    steel: 0.5,
  },
  fairy: {
    fighting: 2,
    dragon: 2,
    dark: 2,
    fire: 0.5,
    poison: 0.5,
    steel: 0.5,
  },
};

// Event listeners

// Initial render
document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve selected Pokémon from session storage
  let pokemon1Data = sessionStorage.getItem("pokemon1");
  let pokemon2Data = sessionStorage.getItem("pokemon2");
  let pokemon1 = JSON.parse(pokemon1Data);
  let pokemon2 = JSON.parse(pokemon2Data);
  // Add Pokémon to pokedex
  await addPokemon(pokemon1, true);
  await addPokemon(pokemon2, false);
  renderFight(); // Render fight interface
});

// Functions

// Add Pokémon to pokedex
async function addPokemon(pokemon, isFirst = false) {
  // Fetch sprite if first Pokémon
  if (isFirst) {
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
    );
    let responseData = await response.json();
    // Use back sprite if available
    pokemon.sprite = responseData.sprites.back_default
      ? responseData.sprites.back_default
      : responseData.sprites.front_default;
  }
  // Push new Pokémon to pokedex
  pokedex.push(
    new Pokemon(
      pokemon.id,
      pokemon.name,
      pokemon.types,
      pokemon.sprite,
      pokemon.attack,
      pokemon.defense,
      pokemon.hp,
      pokemon.speed,
      pokemon.moves
    )
  );
}

// Render fight interface
function renderFight() {
  let fastestIndex = pokedex[0].speed >= pokedex[1].speed ? 0 : 1; // Determine fastest Pokémon
  // Render each Pokémon
  pokedex.forEach((pokemon, index) => {
    const clonedTemplate = temp.content.cloneNode(true);
    // Set front card attributes and styles
    let card = clonedTemplate.querySelector(".pokemon-card");
    card.setAttribute("id", `card-${pokemon.id}`);
    // Populate template with Pokémon data
    card.style.backgroundImage = `var(--type-${pokemon.types[0]}-color)`;
    clonedTemplate.querySelector(".pokemon-name").textContent = pokemon.name;
    clonedTemplate.querySelector(
      ".pokemon-hp"
    ).textContent = `${pokemon.hp} HP`;
    pokemon.hpElement = clonedTemplate.querySelector(".pokemon-hp");
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
    // Position Pokémon cards
    if (index === 0) {
      // First Pokémon at bottom-left
      clonedTemplate
        .querySelector(".pokemon")
        .classList.add("pokemon-bottom-left");
    } else {
      // Second Pokémon at top-right
      clonedTemplate
        .querySelector(".pokemon")
        .classList.add("pokemon-top-right");
    }
    // Set up moves list
    clonedTemplate
      .querySelector(".pokemon-moves-list")
      .setAttribute("id", `pokemon-moves-list-${pokemon.id}`);
    // Hide moves list for slower Pokémon initially
    if (index !== fastestIndex) {
      clonedTemplate
        .querySelector(".pokemon-moves-list")
        .classList.add("hidden");
    }
    // Populate moves
    let movesList = clonedTemplate.querySelector(".moves-list");
    pokemon.moves.slice(0, 4).forEach((move) => {
      const li = document.createElement("li"); // Move list item
      const btn = document.createElement("button"); // Move button
      btn.classList.add("move-button");
      btn.textContent = `${move.name} (Type: ${move.type}, Pow: ${move.power}, Acc: ${move.accuracy})`;
      // Set up attack on move button click
      btn.addEventListener("click", () => {
        performAttack(index, move); // Perform attack
      });

      li.appendChild(btn);
      movesList.appendChild(li);
    });

    fightDiv.appendChild(clonedTemplate);
  });
}

// Perform attack from attacker to defender
async function performAttack(attackerIndex, move) {
  // Determine defender index
  let defenderIndex = attackerIndex === 0 ? 1 : 0;
  // Get attacker and defender Pokémon
  let attacker = pokedex[attackerIndex];
  let defender = pokedex[defenderIndex];
  
  let result = calculateDamage(attacker, defender, move); // Calculate damage
  // Handle attack result
  if (!result.hit) {
    changeShifts(); // Change turns
    await showBattleMessage(`${attacker.name} falló el ataque ${move.name}!`); // Show miss message
  } else {
    // Apply damage to defender
    defender.hp = Math.max(0, defender.hp - result.damage); // Reduce defender HP
    defender.hpElement.textContent = `${defender.hp} HP`; // Update HP display
    // Check if defender is defeated
    if (defender.hp === 0) {
      // Hide moves lists
      pokedex.forEach((pokemon) => {
        document
          .querySelector(`#pokemon-moves-list-${pokemon.id}`)
          .classList.add("hidden");
      });
    } else {
      changeShifts(); // Change turns
    }
    // Show attack result message
    await showBattleMessage(
      `${attacker.name} uses ${move.name} and deals ${result.damage} damage. ` +
      `Effectiveness x${result.effectiveness}`
    );
    // Check again if defender is defeated
    if (defender.hp === 0) {
      // Show defeat messages and end battle
      await showBattleMessage(`${defender.name} has been defeated!`, 2000);
      await showBattleMessage("The battle is over!", 2000);
      window.location.href = "index.html"; // Redirect to main page
    }
  }
}

// Calculate damage from attacker to defender using a move
function calculateDamage(attacker, defender, move) {
  // Check for move hit based on accuracy
  const roll = Math.random() * 100;
  if (roll > move.accuracy) {
    return {
      hit: false,
      damage: 0,
      effectiveness: 0,
    };
  }

  // Base damage calculation
  let damage = move.power * (attacker.attack / 50);

  // STAB (Same-Type Attack Bonus) bonus
  if (attacker.types.includes(move.type)) {
    damage *= 1.5;
  }

  // Type effectiveness
  let effectiveness = getTypeMultiplier(move.type, defender.types);
  damage *= effectiveness;

  // Apply defender's defense
  let defenseMultiplier = (100 - defender.defense) / 100;
  defenseMultiplier = Math.max(defenseMultiplier, 0.1); // Minimum multiplier
  damage *= defenseMultiplier;

  damage = Math.max(1, Math.round(damage)); // Ensure at least 1 damage

  // Return damage result
  return {
    hit: true,
    damage,
    effectiveness,
  };
}

// Get type effectiveness multiplier
function getTypeMultiplier(moveType, defenderTypes) {
  let mult = 1;
  const row = typeChart[moveType] || {}; // Get type chart row
  // Calculate multiplier for each defender type
  defenderTypes.forEach((t) => {
    if (row[t] != null) {
      mult *= row[t];
    }
  });
  return mult;
}

// Show battle message for a duration
function showBattleMessage(text, duration = 4000) {
  // Return a promise that resolves after message is shown
  return new Promise((resolve) => {
    const msgBox = document.getElementById("battle-message"); // Message box element
    if (!msgBox) {
      resolve();
      return;
    }
    // Display message
    msgBox.textContent = text;
    msgBox.classList.add("visible");
    // Clear previous timeout if any
    clearTimeout(showBattleMessage._timeoutId);
    // Hide message after duration
    showBattleMessage._timeoutId = setTimeout(() => {
      msgBox.classList.remove("visible");
      resolve();
    }, duration);
  });
}

// Change turns by toggling moves list visibility
function changeShifts() {
  const pokemonMovesLists = pokedex.map((pokemon) =>
    document.getElementById(`pokemon-moves-list-${pokemon.id}`)
  ); // Get moves list elements
  pokemonMovesLists.forEach((list) => list.classList.toggle("hidden")); // Toggle visibility
}
