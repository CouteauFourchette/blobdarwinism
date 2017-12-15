import * as Config from '../config';
import BlobBrains from './blob_brains';
import * as SimulationUtil from '../simulation/simulation_util';
import Network from './network';
import { debug } from 'util';

class Genetic {

  static newGeneration(blobs, oldGeneration) {
    const blobBrains = new BlobBrains(blobs);
    blobBrains.allBrains().forEach(brain => {
      let newWeights;
      let newBias;
      let newColor;
      if (oldGeneration) {
        const parent1 = Genetic.getFitParent(oldGeneration);
        const parent2 = Genetic.getFitParent(oldGeneration);
        newWeights =  Genetic.produceChildWeights(parent1, parent2);
        newBias = parent1.getNetwork().extractBias();
        newColor = parent1.color.map((color, idx) => {
          return (color + parent2.color[idx])/2;
        });
        brain.color = newColor;
      }

      if (Math.random() < Config.NEW_ENTITIES) {
        newWeights = undefined;
        brain.color = SimulationUtil.randomColor();
      }

      brain.setNetwork(
        new Network(...Config.NETWORK_DIMENSIONS, newWeights, newBias)
      );
    });
    return blobBrains;
  }

  static saveGeneration(generation) {
    const jsonObject = { 'brains': {}, 'config': {}};
    generation.allBrains().forEach((blobBrain) => {
      const network = blobBrain.getNetwork();
      jsonObject['brains'][blobBrain.id] = {
        structure: network.extractStructure(),
        weights: network.extractWeights(),
        bias: network.extractBias()
      };
    });
    const config = Object.keys(Config);
    for (let i = 0; i < config.length; i += 1) {
      jsonObject['config'][config[i]] = Config[config[i]];
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify(jsonObject));
    return dataStr;
  }

  static loadGeneration(jsonGeneration) {
    const generation = JSON.parse(jsonGeneration);
    const ids = Object.keys(generation);
    const blobBrains = [];
    ids.forEach(id => {
      const weights = generation[id].weights;
      const bias = generation[id].bias;
      const structure = generation[id].structure;
    });
  }

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

  static produceChildWeights(parent1, parent2) {
    return Genetic.breed(
      parent1.getNetwork().extractWeights(),
      parent2.getNetwork().extractWeights()
    );
  }

  static produceChildBias(parent1, parent2) {
    return Genetic.breed(
      parent1.getNetwork().extractBias(),
      parent2.getNetwork().extractBias()
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
          if (Math.random() <= Config.GENETIC_CROSSOVER) {
            newWeights[i][j][k] = weightsA[i][j][k];
          } else {
            newWeights[i][j][k] = weightsB[i][j][k];
          }

          if (Math.random() < Config.MUTATION_RATE) {
            newWeights[i][j][k] += (2 * Math.random() - 1) * Config.MUTATION_RANGE;
          }
        }

      }
    }
    return newWeights;
  }
}

export default Genetic;
