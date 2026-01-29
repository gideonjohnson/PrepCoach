// Anonymous identity generation for expert sessions

const ADJECTIVES = [
  'Swift', 'Bright', 'Calm', 'Bold', 'Sharp',
  'Keen', 'Wise', 'Clear', 'Fair', 'Warm',
  'Quick', 'Brave', 'Pure', 'True', 'Deep',
  'Cool', 'Kind', 'Free', 'Grand', 'Noble',
  'Witty', 'Sage', 'Vivid', 'Agile', 'Crisp',
  'Deft', 'Fluid', 'Lucid', 'Nimble', 'Steady',
];

const ANIMALS = [
  'Falcon', 'Otter', 'Lynx', 'Heron', 'Fox',
  'Hawk', 'Wolf', 'Bear', 'Deer', 'Owl',
  'Eagle', 'Crane', 'Robin', 'Panda', 'Tiger',
  'Raven', 'Dove', 'Swan', 'Bison', 'Koala',
  'Badger', 'Osprey', 'Jaguar', 'Coral', 'Phoenix',
  'Condor', 'Mantis', 'Stork', 'Ibis', 'Gecko',
];

export function generateAnonymousAlias(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${animal}${num}`;
}

export function generateSessionAliases(): {
  candidateAlias: string;
  interviewerAlias: string;
} {
  let candidateAlias = generateAnonymousAlias();
  let interviewerAlias = generateAnonymousAlias();

  // Ensure they're different
  while (interviewerAlias === candidateAlias) {
    interviewerAlias = generateAnonymousAlias();
  }

  return { candidateAlias, interviewerAlias };
}
