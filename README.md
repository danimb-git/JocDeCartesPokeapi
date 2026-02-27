# Pokémon Card Game — PokéAPI

A Pokémon card battle game built with **HTML, CSS, and vanilla JavaScript** that consumes the [PokéAPI](https://pokeapi.co/) to fetch real Pokémon data.

## Description

The app generates random Pokémon cards and lets the user select two of them to start a turn-based battle featuring a damage system with type effectiveness, STAB bonus, and move accuracy.

## Features

- **Random Pokédex** — Generates between 2 and 16 random Pokémon with real data from the PokéAPI (stats, types, sprite, moves).
- **Interactive cards** — Each card displays name, HP, image, types, attack, defense, speed, and a button to view the move set.
- **Flip animation** — Selecting a card triggers a 3D CSS flip animation.
- **Fighter selection** — Select exactly 2 Pokémon for battle; selecting a third automatically deselects the first.
- **Turn-based combat** — The fastest Pokémon attacks first. Each turn, the player picks one of 4 available moves.
- **Full damage system**:
  - Base move power × (Attack / 50)
  - **STAB** bonus (×1.5 when the move type matches the Pokémon's type)
  - Full **type effectiveness** chart (18 types with 0×, 0.5×, and 2× multipliers)
  - Defender's defense reduction
  - **Accuracy** system — moves can miss
- **Battle messages** — Displays the result of each attack including effectiveness and damage dealt.
- **Type-based colors** — Each card's background changes according to the Pokémon's primary type.

## Project Structure

```
dist/
├── css/
│   └── style.css          # Application styles
├── img/
│   ├── background.jpg     # Battle arena background
│   └── pokemon_card_backside.png  # Card back side
├── js/
│   ├── script.js          # Pokédex & selection logic
│   └── fight.js           # Turn-based battle logic
├── index.html             # Main page (Pokédex)
└── fight.html             # Battle page
```

## Technologies

| Technology | Usage |
|---|---|
| HTML5 | Structure & `<template>` elements for cards |
| CSS3 | Responsive design, 3D flip animations, type-based gradients |
| JavaScript (ES6+) | Fetch API, async/await, DOM manipulation, sessionStorage |
| [PokéAPI](https://pokeapi.co/) | Pokémon data source (stats, sprites, moves) |
| [gh-pages](https://www.npmjs.com/package/gh-pages) | GitHub Pages deployment |

## Installation & Usage

### Option 1 — Open directly

Open `dist/index.html` in your browser.

### Option 2 — Deploy to GitHub Pages

```bash
npm install
npm run deploy
```

## How to Play

1. Choose how many Pokémon you want to see (2–16) and click **Update**.
2. Click **Select** on two Pokémon to pick them as fighters.
3. Press **Start fight** to begin the battle.
4. On the battle screen, choose a move to attack the opponent.
5. Turns alternate until one Pokémon runs out of HP.

## API

All data is fetched in real time from the PokéAPI:

- `GET https://pokeapi.co/api/v2/pokemon/{id}` — Pokémon data (stats, sprites, moves)
- `GET https://pokeapi.co/api/v2/move/{id}` — Move details (power, accuracy, type)

## License

ISC
