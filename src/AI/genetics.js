const GENETIC_CROSSOVER = 0.5;
const MUTATION_RATE = 0.01;
const MUTATION_RANGE = 0.2;

class Genetic {

  static getFitParent(blobBrainsObj) {
    const blobBrains = Object.keys(blobBrainsObj).map(blobId => blobBrainsObj[blobId]);
    const totalFit = blobBrains.reduce((acc, brain) => acc + brain.fitness, 0);
    const probability = Math.random();

    let cumProb = 0;
    for (let i = 0; i < blobBrains.length; i += 1) {
      const brain = blobBrains[i];
      if (probability < ((brain.fitness / totalFit) + cumProb)) {
        return brain;
      }
      cumProb += (brain.fitness / totalFit);
    }
  }

  static breed(networkA, networkB) {
    const networkSize = networkA.length;
    const networkC = [];
    for (let i = 0; i < networkSize; i += 1) {
      if (Math.random() <= GENETIC_CROSSOVER) {
        networkC[i] = networkA[i];
      } else {
        networkC[i] = networkB[i];
      }

      if (Math.random() < MUTATION_RATE) {
        networkC[i] += (Math.random()-0.5) * MUTATION_RANGE;
      }
    }
    return networkC;
  }
}

export default Genetic;
