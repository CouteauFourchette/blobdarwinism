import { multiply, tanh } from 'mathjs';


function randomWeightsGen(input, output) {
  const randomWeights = [];
  for (let i = 0; i < input; i += 1) {
    randomWeights[i] = [];
    for (let j = 0; j < output; j += 1) {
      randomWeights[i][j] = 2 * Math.random() - 1;
    }
  }
  return randomWeights;
}

class Network {
  constructor(input, hidden, output, weights) {
    this.structure = [input, hidden, output];
    if (weights) {
      this.weightArray = weights;
    } else {
      // Randomly initialize weights
      let previous = input;
      this.weightArray = [];
      for (let i = 0; i < hidden.length; i += 1) {
        this.weightArray.push(randomWeightsGen(previous, hidden[i]));
        previous = hidden[i];
      }
      this.weightArray.push(randomWeightsGen(hidden[hidden.length - 1], output));
    }
  }

  activate(input) {
    const [inputN, hiddenN, outputN] = this.structure;
    let previousLayer = input;
    let layer = undefined;
    for (let i = 0; i < hiddenN.length; i += 1) {
      const weights = this.weightArray[i];
      layer = tanh(multiply(previousLayer, weights));
      previousLayer = layer;
    }
    const output = multiply(previousLayer, this.weightArray[this.weightArray.length - 1]);
    return output;
  }

  extractWeights() {
    return this.weightArray;
  }

  extractStructure() {
    return this.structure;
  }
}


export default Network;