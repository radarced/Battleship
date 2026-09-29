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

export { inRange, cosDegrees, sinDegrees };
