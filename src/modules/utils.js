// returns true if a <= x <= b; meaning its in range of [a,b]
function inRange(x, a, b) {
  return x >= a && x <= b;
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function cosDegrees(degrees) {
  return +Math.cos(degreesToRadians(degrees)).toFixed(2); // so that i get precise results and not have to get into floating point drama
}

function sinDegrees(degrees) {
  return +Math.sin(degreesToRadians(degrees)).toFixed(2); // so that i get precise results and not have to get into floating point drama
}
const CharacterMap = {
  a: true,
  b: true,
  c: true,
  d: true,
  e: true,
  f: true,
  g: true,
  h: true,
  i: true,
  j: true,
  k: true,
  l: true,
  m: true,
  n: true,
  o: true,
  p: true,
  q: true,
  r: true,
  s: true,
  t: true,
  u: true,
  v: true,
  w: true,
  x: true,
  y: true,
  z: true,
};

function CapitilizeWord(word) {
  let FirstChar = word.at(0);
  if (CharacterMap[FirstChar] !== undefined) {
    // no coercion if the character does exist then capitilize the strings first character;
    return `${FirstChar.toUpperCase()}${word.slice(1)}`;
  }
  return word;
}

export { inRange, cosDegrees, sinDegrees, CapitilizeWord };
