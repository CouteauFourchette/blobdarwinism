export function randomWeightsGen(input, output) {
  const randomWeights = [];
  for (let i = 0; i < input; i += 1) {
    randomWeights[i] = [];
    for (let j = 0; j < output; j += 1) {
      randomWeights[i][j] = 2 * Math.random() - 1;
    }
  }
  return randomWeights;
}

export function randomBiasGen(n) {
  const randomBias = [];
  for (let i = 0; i < n; i += 1) {
    randomBias[i] = (Math.random() - 0.5) / 2;
  }
  return randomBias;
}