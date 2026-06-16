const ADJECTIVES = [
  "happy",
  "silly",
  "funny",
  "crazy",
  "magic",
  "lazy",
  "speedy",
  "fancy",
  "golden",
  "jolly",
  "clever",
  "dashing",
];
const NOUNS = [
  "panda",
  "fox",
  "koala",
  "dino",
  "rabbit",
  "tiger",
  "cat",
  "dog",
  "octopus",
  "monkey",
  "penguin",
  "unicorn",
];

export function generateRoomID(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10; // 2-digit number
  return `${adj}-${noun}-${num}`;
}
