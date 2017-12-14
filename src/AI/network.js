import { multiply, tanh, add } from 'mathjs';
import * as AIUtil from './ai_util';

class Network {
  constructor(input, hidden, output, weights, bias) {
    this.structure = [input, hidden, output];
    if (weights && bias) {
      this.weightArray = weights;
      this.biasArray = bias;
    } else {
      // Randomly initialize weights
      let previous = input;
      this.weightArray = [];
      this.biasArray = [];
      for (let i = 0; i < hidden.length; i += 1) {
        this.weightArray.push(AIUtil.randomWeightsGen(previous, hidden[i]));
        this.biasArray.push(AIUtil.randomBiasGen(hidden[i]));
        previous = hidden[i];
      }
      this.weightArray.push(AIUtil.randomWeightsGen(hidden[hidden.length - 1], output));
    }
  }

  activate(input) {
    const [inputN, hiddenN, outputN] = this.structure;
    let previousLayer = input;
    let layer = undefined;
    for (let i = 0; i < hiddenN.length; i += 1) {
      const weights = this.weightArray[i];
      layer = tanh(add(multiply(previousLayer, weights), this.biasArray[i]));
      previousLayer = layer;
    }
    const output = multiply(previousLayer, this.weightArray[this.weightArray.length - 1]);
    return output;
  }

  extractWeights() {
    return this.weightArray;
  }

  extractBias() {
    return this.biasArray;
  }

  extractStructure() {
    return this.structure;
  }
}


export default Network;