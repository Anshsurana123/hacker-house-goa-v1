const TIME_MODIFIERS = [
  "Midnight", "Sunset", "Monsoon", "Dawn", "3AM", "Twilight", "Sunrise", "Moonlit",
  "Late-Night", "Weekend", "After-Hours", "Red-Eye", "Golden-Hour", "Pre-Dawn",
  "Overclocked", "Turbo", "Hyperspeed", "Zero-Day", "Sprint", "Marathon", "Hackathon",
  "All-Nighter", "Crunch-Time", "Deep-Focus", "Flow-State", "Peak", "Stealth",
  "Underground", "Rogue", "Rapid", "Quantum", "Neural", "Cyber", "Digital",
  "Offshore", "Coastal", "Tropical", "Beach", "Jungle", "Monsoon-Season",
  "Tidal", "Reef", "Harbor", "Lighthouse", "Palm-Tree", "Coconut", "Spice-Route",
  "Arabian-Sea", "Goan", "Mandovi", "Chapora", "Vagator", "Baga", "Calangute"
];

const ACTIONS = [
  "Debugging", "Shipping", "Deploying", "Hacking", "Building", "Coding",
  "Compiling", "Refactoring", "Architecting", "Scaling", "Optimizing",
  "Crafting", "Engineering", "Designing", "Prototyping", "Iterating",
  "Launching", "Wrangling", "Surfing", "Wave-Riding", "Sandboxing",
  "Benchmarking", "Profiling", "Orchestrating", "Automating", "Streaming",
  "Rendering", "Crunching", "Mining", "Forging", "Weaving", "Scraping",
  "Reverse-Engineering", "Bootstrapping", "Finetuning"
];

const NOUNS = [
  "Ninja", "Wizard", "Architect", "Pirate", "Samurai", "Viking", "Maverick",
  "Alchemist", "Sorcerer", "Nomad", "Explorer", "Navigator", "Captain",
  "Commander", "Guru", "Sensei", "Sage", "Oracle", "Phoenix", "Dragon",
  "Titan", "Ronin", "Artisan", "Voyager", "Pioneer", "Trailblazer",
  "Pathfinder", "Ranger", "Sentinel", "Guardian", "Catalyst", "Cipher",
  "Hacker", "Maker", "Builder", "Shipper", "Coder", "Developer", "Creator",
  "Visionary", "Tinker", "Maestro"
];

function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateTitle(): string {
  const mod = sample(TIME_MODIFIERS);
  const act = sample(ACTIONS);
  const noun = sample(NOUNS);
  return `${mod} ${act} ${noun}`;
}

export function rerollTitle(current: string): string {
  let title = generateTitle();
  while (title === current) {
    title = generateTitle();
  }
  return title;
}
