/**
 * src/data/empowerment.js
 *
 * Large pool of women-in-tech facts and inspiring quotes.
 * On every page load, a random selection is shown.
 * To add more: just push new objects into FACTS_POOL or QUOTES_POOL.
 */

export const FACTS_POOL = [
  {
    icon: '💻',
    title: 'Ada Lovelace — The First Programmer',
    body: 'In 1843, Ada Lovelace wrote the world\'s first computer algorithm — before computers even existed.',
    variant: 'green',
  },
  {
    icon: '🚀',
    title: 'Women Sent Humans to the Moon',
    body: 'Katherine Johnson\'s mathematical genius calculated NASA\'s flight trajectories for the 1969 Moon landing.',
    variant: 'coral',
  },
  {
    icon: '🔬',
    title: 'Grace Hopper Built Modern Computing',
    body: 'Admiral Grace Hopper invented the first compiler and popularised machine-independent programming.',
    variant: 'green',
  },
  {
    icon: '🌐',
    title: 'Women Sparked the AI Revolution',
    body: 'Fei-Fei Li co-created ImageNet — the dataset that powered the entire deep learning explosion in AI.',
    variant: 'coral',
  },
  {
    icon: '📡',
    title: 'Hedy Lamarr Invented Wi-Fi\'s Ancestor',
    body: 'Actress and inventor Hedy Lamarr co-developed frequency-hopping signal technology — the foundation of Bluetooth and Wi-Fi.',
    variant: 'green',
  },
  {
    icon: '🧬',
    title: 'Rosalind Franklin Unlocked DNA',
    body: 'Franklin\'s X-ray crystallography work was crucial to discovering the double-helix structure of DNA.',
    variant: 'coral',
  },
  {
    icon: '🤖',
    title: 'Women Lead AI Ethics',
    body: 'Timnit Gebru and Joy Buolamwini are at the forefront of exposing bias in AI systems and pushing for fairer technology.',
    variant: 'green',
  },
  {
    icon: '🌍',
    title: '130M+ Girls Are Out of School',
    body: 'Globally, 130 million girls are denied education — yet those who stay in school transform their communities and economies.',
    variant: 'coral',
  },
  {
    icon: '🏆',
    title: 'First Female Turing Award',
    body: 'Frances Allen became the first woman to win the Turing Award (2006) for her pioneering work on compiler optimisation.',
    variant: 'green',
  },
  {
    icon: '🛸',
    title: 'Margaret Hamilton Coined "Software Engineering"',
    body: 'Hamilton led the team that wrote the on-board flight software for Apollo 11 and invented the term "software engineering".',
    variant: 'coral',
  },
  {
    icon: '🔐',
    title: 'Women Excel in Cybersecurity',
    body: 'The percentage of women in cybersecurity has grown from 11% (2013) to over 24% (2022) and is accelerating fast.',
    variant: 'green',
  },
  {
    icon: '📱',
    title: 'Radia Perlman Built the Internet\'s Backbone',
    body: 'Known as the "Mother of the Internet", Radia Perlman invented the Spanning Tree Protocol that makes Ethernet networks work.',
    variant: 'coral',
  },
];

export const QUOTES_POOL = [
  { text: 'The question isn\'t who\'s going to let me — it\'s who\'s going to stop me.', author: 'Ayn Rand' },
  { text: 'Science and everyday life cannot and should not be separated.', author: 'Rosalind Franklin, X-ray Crystallographer' },
  { text: 'I always did something I was a little not ready to do. That\'s how you grow.', author: 'Marissa Mayer, Former CEO of Yahoo' },
  { text: 'The most courageous act is still to think for yourself. Aloud.', author: 'Coco Chanel' },
  { text: 'Women belong in all places where decisions are being made.', author: 'Ruth Bader Ginsburg' },
  { text: 'I have learned over the years that when one\'s mind is made up, this diminishes fear.', author: 'Rosa Parks' },
  { text: 'If you\'re offered a seat on a rocket ship, don\'t ask what seat! Just get on.', author: 'Sheryl Sandberg, COO of Meta' },

  { text: 'One of the most courageous things you can do is identify yourself, know who you are, what you believe in and where you want to go.', author: 'Sheila Murray Bethel' },
  { text: 'We need to reshape our own perception of how we view ourselves. We have to step up as women and take the lead.', author: 'Beyoncé' },
  { text: 'Somewhere out in this audience may even be someone who will one day fire a rocket to Mars.', author: 'Christa McAuliffe, NASA Astronaut' },
  { text: 'The question isn\'t can I do it, it\'s how I\'ll do it.', author: 'Indira Nooyi, Former CEO of PepsiCo' },
  { text: 'Code like a girl — better, faster, and with more style.', author: 'Anonymous' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { text: 'You are braver than you believe, stronger than you seem, and smarter than you think.', author: 'A.A. Milne' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
];

export const STATS = [
  { number: '57%', label: 'of college graduates are women — yet only 26% enter tech careers. Time to close the gap.' },
  { number: '3×', label: 'Companies with diverse teams are 3× more likely to be high-performing and profitable.' },
  { number: '$12T', label: 'Projected global GDP boost by fully advancing women\'s equality in the workforce.' },
  { number: '2×', label: 'Startups with at least one female founder produce 2× more revenue per dollar invested.' },
  { number: '41%', label: 'Women who enter tech professions leave by mid-career — we need to change that narrative.' },
  { number: '78%', label: 'of women in tech say having a mentor was critical to their career success.' },
];

/** Returns a random subset of arr with size n */
export function randomPick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
