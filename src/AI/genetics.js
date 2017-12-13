const GENETIC_CROSSOVER = 0.5;
const MUTATION_RATE = 0.02;
const MUTATION_RANGE = 0.2;

class Genetic {

  static getFitParent(blobBrainsObj) {
    const blobBrains = blobBrainsObj.allBrains();
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
      newWeights[i] = [];
      for(let j = 0; j < weightsA[i].length; j++){
        newWeights[i][j] = [];
        for (let k = 0; k < weightsA[i][j].length; k += 1) {
          if (Math.random() <= GENETIC_CROSSOVER) {
            newWeights[i][j][k] = weightsA[i][j][k];
          } else {
            newWeights[i][j][k] = weightsB[i][j][k];
          }

          if (Math.random() < MUTATION_RATE) {
            newWeights[i][j][k] += (2 * Math.random() - 1) * MUTATION_RANGE;
          }
        }

      }
    }
    return newWeights;
  }
}

export default Genetic;
