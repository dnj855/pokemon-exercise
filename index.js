import { prompt } from "./prompt.js";

class Pokemon {
  /**
   *
   * @param {String} name
   * @param {String} emoji
   * @param {Number} health
   * @param {Array} attacks
   */
  constructor(name, emoji, health, attacks) {
    this.name = name;
    this.emoji = emoji;
    this.maxHealth = health;
    this.currentHealth = health;
    this.attacks = attacks;
  }

  randomAttack() {
    return this.attacks[Math.floor(Math.random() * this.attacks.length)];
  }

  logAttack() {
    let i = 1;
    for (let attack of this.attacks) {
      console.log(
        `${i}. ${attack.name} - Power ⚡️: ${attack.power} - Stability 💥 : ${attack.stability}`
      );
      i++;
    }
  }

  logPokemon(attacks = false) {
    console.log(`
    ${this.name} ${this.emoji} - Health : ${this.currentHealth}`);
    if (attacks) {
      this.logAttack();
    }
  }

  getHealth() {
    let healthBar = "";
    const segments = 10; // Nombre de segments dans la barre de vie
    const healthPerSegment = this.maxHealth / segments; // Santé que représente chaque segment

    for (let i = 0; i < segments; i++) {
      if (this.currentHealth > i * healthPerSegment) {
        healthBar += "🟩";
      } else {
        healthBar += "🟥";
      }
    }
    return healthBar;
  }
}

class Attack {
  /**
   *
   * @param {String} name
   * @param {Number} power
   * @param {Number} stability
   */
  constructor(name, power, stability) {
    this.name = name;
    this.power = power;
    this.stability = stability;
  }

  performAttack() {
    const baseDamage = this.power * this.stability; // Dégâts de base, influencés par la stabilité
    const variability = this.power * (1 - this.stability); // La variabilité des dégâts augmente quand la stabilité diminue
    const randomVariation = Math.random() * variability; // Variation aléatoire, maximale équivalant à la variabilité
    const totalDamage = baseDamage + randomVariation; // Dégâts totaux calculés
    return Math.round(totalDamage);
  }

  logAttack() {
    console.log(
      `${this.name} - Power ⚡️: ${this.power} - Stability 💥 : ${this.stability}`
    );
  }
}

class Game {
  constructor(pokemons) {
    this.pokemons = pokemons;
  }

  logPokemons() {
    let i = 1;
    for (let pokemon of this.pokemons) {
      console.log(
        `${i}. ${pokemon.name} ${pokemon.emoji} - Health : ${pokemon.currentHealth}`
      );
      i++;
    }
  }

  userChoice() {
    let userChoice;
    do {
      this.logPokemons();
      userChoice = Number(prompt("Chose the Pokemon you want : "));
      if (
        Number.isNaN(userChoice) ||
        userChoice < 1 ||
        userChoice > this.pokemons.length
      ) {
        console.log(
          `⚠️ Please chose a valid Pokemon (with a number between 1 and ${this.pokemons.length}).
          `
        );
      }
    } while (
      Number.isNaN(userChoice) ||
      userChoice < 1 ||
      userChoice > this.pokemons.length
    );
    return userChoice - 1;
  }

  logBattle(userPokemon, computerPokemon) {
    console.log("");
    console.log("Battle :");
    console.log("");
    console.log(`${userPokemon.getHealth()}`);
    console.log(`${userPokemon.name} ${userPokemon.emoji}`);
    console.log("");
    console.log("⚡️VS ⚡️");
    console.log("");
    console.log(`${computerPokemon.getHealth()}`);
    console.log(`${computerPokemon.name} ${computerPokemon.emoji}`);
    console.log("");
  }

  playerAttack(pokemon, attacks) {
    let playerAttack;
    do {
      pokemon.logAttack();
      playerAttack = Number(prompt("Choose your attack: "));
      if (
        Number.isNaN(playerAttack) ||
        playerAttack < 1 ||
        playerAttack > attacks.length
      ) {
        console.log(
          `⚠️ Please choose a valid Attack (with a number between 1 and ${attacks.length}).`
        );
        console.log("");
      }
    } while (
      Number.isNaN(playerAttack) ||
      playerAttack < 1 ||
      playerAttack > attacks.length
    );
    return attacks[playerAttack - 1];
  }

  battle(userPokemon, computerPokemon) {
    this.logBattle(userPokemon, computerPokemon);
    const playerAttack = this.playerAttack(userPokemon, userPokemon.attacks);
    const computerAttack = computerPokemon.randomAttack();
    const userDamage = computerAttack.performAttack();
    const computerDamage = playerAttack.performAttack();
    console.log(
      `👊 The attack ${playerAttack.name} made ${computerDamage} damage to ${computerPokemon.name}.\n❌ The attack ${computerAttack.name} made ${userDamage} damage to ${userPokemon.name}.`
    );
    userPokemon.currentHealth -= userDamage;
    computerPokemon.currentHealth -= computerDamage;
  }

  play() {
    console.log("Welcome to Pokemon Game !");
    const userChoice = this.userChoice();
    const availablePokemons = this.pokemons.filter((_, i) => userChoice !== i);
    const userPokemon = this.pokemons[userChoice];
    const computerPokemon =
      availablePokemons[Math.floor(Math.random() * availablePokemons.length)];
    this.battle(userPokemon, computerPokemon);
  }
}

const pikachu = new Pokemon("Pikachu", "⚡️", 100, [
  new Attack("Thunderbolt", 30, 0.2),
  new Attack("Electro Ball", 20, 0.4),
  new Attack("Quick Attack", 10, 0.8),
]);

const bulbasaur = new Pokemon("Bulbasaur", "🍃", 110, [
  new Attack("Vine Whip", 25, 0.3),
  new Attack("Seed Bomb", 20, 0.5),
  new Attack("Tackle", 10, 0.8),
]);

const charmander = new Pokemon("Charmander", "🔥", 90, [
  new Attack("Flamethrower", 35, 0.2),
  new Attack("Ember", 25, 0.3),
  new Attack("Scratch", 15, 0.75),
]);

const game = new Game([pikachu, bulbasaur, charmander]);

game.play();
