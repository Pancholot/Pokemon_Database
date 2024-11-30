export class Pokemon {
  abilities: Array<string>;
  attack: number;
  base_egg_steps: number;
  base_happiness: number;
  base_total: number;
  capture_rate: number;
  classification: string;
  defense: number;
  experience_growth: number;
  generation: number;
  height_m: number | null;
  hp: number;
  is_legendary: string;
  name: string;
  percentage_male: number | null;
  pokedex_number: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
  type1: string;
  type2: string | null;
  weight_kg: number | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(...args: any[]) {
    const {
      pokedex_number,
      name,
      abilities,
      attack,
      base_egg_steps,
      base_hapiness,
      base_total,
      capture_rate,
      classification,
      defense,
      experience_growth,
      generation,
      height_m,
      hp,
      is_legendary,
      percentage_male,
      sp_attack,
      sp_defense,
      speed,
      type1,
      type2,
      weight_kg,
    } = args[0];

    this.pokedex_number = pokedex_number;
    this.name = name;
    this.abilities = abilities;
    this.attack = attack;
    this.base_egg_steps = base_egg_steps;
    this.base_happiness = base_hapiness;
    this.base_total = base_total;
    this.capture_rate = capture_rate;
    this.classification = classification;
    this.defense = defense;
    this.experience_growth = experience_growth;
    this.generation = generation;
    this.height_m = height_m;
    this.hp = hp;
    this.is_legendary = is_legendary;
    this.percentage_male = percentage_male;
    this.sp_attack = sp_attack;
    this.sp_defense = sp_defense;
    this.speed = speed;
    this.type1 = type1;
    this.type2 = type2;
    this.weight_kg = weight_kg;
  }

  get image(): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokedex_number}.png`;
  }
}
