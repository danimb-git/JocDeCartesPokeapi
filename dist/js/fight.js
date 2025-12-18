const fightDiv = document.getElementById("fight");
const temp = document.getElementById("template");

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

document.addEventListener("DOMContentLoaded", async () => {
  let pokemon1Data = sessionStorage.getItem("pokemon1");
  let pokemon2Data = sessionStorage.getItem("pokemon2");
  let pokemon1 = JSON.parse(pokemon1Data);
  let pokemon2 = JSON.parse(pokemon2Data);
  await addPokemon(pokemon1, true);
  await addPokemon(pokemon2, false);
  renderFight();
});

async function addPokemon(pokemon, isFirst = false) {
  if (isFirst) {
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
    );
    let responseData = await response.json();
    pokemon.sprite = responseData.sprites.back_default
      ? responseData.sprites.back_default
      : responseData.sprites.front_default;
  }

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

function renderFight() {
  let fastestIndex = pokedex[0].speed >= pokedex[1].speed ? 0 : 1;
  pokedex.forEach((pokemon, index) => {
    const clonedTemplate = temp.content.cloneNode(true);

    let card = clonedTemplate.querySelector(".pokemon-card");
    card.setAttribute("id", `card-${pokemon.id}`);
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
    if (index === 0) {
      clonedTemplate
        .querySelector(".pokemon")
        .classList.add("pokemon-bottom-left");
    } else {
      clonedTemplate
        .querySelector(".pokemon")
        .classList.add("pokemon-top-right");
    }

    clonedTemplate
      .querySelector(".pokemon-moves-list")
      .setAttribute("id", `pokemon-moves-list-${pokemon.id}`);

    if (index !== fastestIndex) {
      clonedTemplate
        .querySelector(".pokemon-moves-list")
        .classList.add("hidden");
    }

    let movesList = clonedTemplate.querySelector(".moves-list");
    pokemon.moves.slice(0, 4).forEach((move) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.classList.add("move-button");
      btn.textContent = `${move.name} (Type: ${move.type}, Pow: ${move.power}, Acc: ${move.accuracy})`;

      btn.addEventListener("click", () => {
        performAttack(index, move);
      });

      li.appendChild(btn);
      movesList.appendChild(li);
    });

    fightDiv.appendChild(clonedTemplate);
  });
}

async function performAttack(attackerIndex, move) {
  let defenderIndex = attackerIndex === 0 ? 1 : 0;
  let attacker = pokedex[attackerIndex];
  let defender = pokedex[defenderIndex];

  let result = calculateDamage(attacker, defender, move);
  if (!result.hit) {
    changeShifts();
    await showBattleMessage(`${attacker.name} falló el ataque ${move.name}!`);
  } else {
    defender.hp = Math.max(0, defender.hp - result.damage);
    defender.hpElement.textContent = `${defender.hp} HP`;

    if (defender.hp === 0) {
      pokedex.forEach((pokemon) => {
        document
          .querySelector(`#pokemon-moves-list-${pokemon.id}`)
          .classList.add("hidden");
      });
    } else {
      changeShifts();
    }

    await showBattleMessage(
      `${attacker.name} usa ${move.name} y hace ${result.damage} de daño. ` +
        `Efectividad x${result.effectiveness}`
    );
    if (defender.hp === 0) {
      await showBattleMessage(`${defender.name} ha sido derrotado!`, 2000);
      await showBattleMessage("La pelea ha terminado!", 2000);
      window.location.href = "index.html";
    }
  }
}

function calculateDamage(attacker, defender, move) {
  const roll = Math.random() * 100;
  if (roll > move.accuracy) {
    return {
      hit: false,
      damage: 0,
      effectiveness: 0,
    };
  }

  let damage = move.power * (attacker.attack / 50);

  if (attacker.types.includes(move.type)) {
    damage *= 1.5;
  }

  let effectiveness = getTypeMultiplier(move.type, defender.types);
  damage *= effectiveness;

  let defenseMultiplier = (100 - defender.defense) / 100;
  defenseMultiplier = Math.max(defenseMultiplier, 0.1);
  damage *= defenseMultiplier;

  damage = Math.max(1, Math.round(damage));

  return {
    hit: true,
    damage,
    effectiveness,
  };
}

function getTypeMultiplier(moveType, defenderTypes) {
  let mult = 1;
  const row = typeChart[moveType] || {};
  defenderTypes.forEach((t) => {
    if (row[t] != null) {
      mult *= row[t];
    }
  });
  return mult;
}

function showBattleMessage(text, duration = 4000) {
  return new Promise((resolve) => {
    const msgBox = document.getElementById("battle-message");
    if (!msgBox) {
      resolve();
      return;
    }

    msgBox.textContent = text;
    msgBox.classList.add("visible");

    clearTimeout(showBattleMessage._timeoutId);

    showBattleMessage._timeoutId = setTimeout(() => {
      msgBox.classList.remove("visible");
      resolve();
    }, duration);
  });
}

function changeShifts() {
  const pokemonMovesLists = pokedex.map((pokemon) =>
    document.getElementById(`pokemon-moves-list-${pokemon.id}`)
  );
  pokemonMovesLists.forEach((list) => list.classList.toggle("hidden"));
}
