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

  static produceChildWeights(blobBrainsObj) {
    return Genetic.breed(
      Genetic.getFitParent(blobBrainsObj).getNetwork().extractWeights(),
      Genetic.getFitParent(blobBrainsObj).getNetwork().extractWeights()
    );
  }

  static breed(weightsA, weightsB) {
    const networkSize = weightsA.length;
    const newWeights = [];
    for (let i = 0; i < networkSize; i += 1) {
      if (Math.random() <= GENETIC_CROSSOVER) {
        newWeights[i] = weightsA[i];
      } else {
        newWeights[i] = weightsB[i];
      }

      if (Math.random() < MUTATION_RATE) {
        newWeights[i] += (Math.random()-0.5) * MUTATION_RANGE;
      }
    }
    return newWeights;
  }
}

export default Genetic;
