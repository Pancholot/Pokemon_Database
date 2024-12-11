export type Trainer = {
  _id: string;
  name: string;
  region: string;
  pokemon_team: Array<number>;
  friends: Array<string>;
  requests: Array<unknown>;
};
