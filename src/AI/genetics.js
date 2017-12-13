const GENETIC_CROSSOVER = 0.5;
const MUTATION_RATE = 0.02;
const MUTATION_RANGE = 0.2;

class Genetic {

  static getFitParent(blobBrainsObj) {
    const blobBrains = blobBrainsObj.allBrains();
    const totalFit = blobBrains.reduce((acc, brain) => acc + brain.fitness, 0);
    const probability = Math.random();

    const sortedBrains = blobBrains.sort((a, b) => {
      if (a.fitness > b.fitness) return -1;
      if (b.fitness < a.fitness) return 1;
      return 0;
    });

    return sortedBrains[0];

    // let cumProb = 0;
    // for (let i = 0; i < blobBrains.length; i += 1) {
    //   const brain = blobBrains[i];
    //   if (probability < ((brain.fitness / totalFit) + cumProb)) {
    //     return brain;
    //   }
    //   cumProb += (brain.fitness / totalFit);
    // }
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
        if (Math.random() <= GENETIC_CROSSOVER) {
          newWeights[i][j] = weightsA[i][j];
        } else {
          newWeights[i][j] = weightsB[i][j];
        }

        if (Math.random() < MUTATION_RATE) {
          newWeights[i][j] += (2*Math.random()-1) * MUTATION_RANGE;
        }
      }
    }  
    return newWeights;
  }
}

export default Genetic;
