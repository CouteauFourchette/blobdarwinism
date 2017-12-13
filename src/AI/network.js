import { Graph, Array1D, Array2D, NDArrayMathGPU, Session } from 'deeplearn';

const math = new NDArrayMathGPU();

class Network {
  constructor(input, hidden, output, weights) {
    const graph = new Graph();
    this.session = new Session(graph, math);

    this.inputLayer = graph.placeholder('input', [input]);

    this.structure = [input, hidden, output];

    if (weights) {
      this.weightArray = weights;
    } else {
      // Randomly initialize weights
      let previous = input;
      this.weightArray = [];
      for (let i = 0; i < hidden.length; i += 1) {
        const randomWeights = [...new Array(previous * hidden[i])].map(() => Math.random());
        this.weightArray.push(randomWeights);
        previous = hidden[i];
      }
      const randomWeights = [...new Array(output * hidden[hidden.length - 1])].map(() => Math.random());
      this.weightArray.push(randomWeights);
    }


    this.weights = {};
    const hiddenLayers = {};
    let previous = input;
    let previousLayer = this.inputLayer;
    for (let i = 0; i < hidden.length; i += 1) {
      const array2d = Array2D.new([previous, hidden[i]], this.weightArray[i]);
      this.weights[i] = graph.variable(`w${i}`, array2d);
      hiddenLayers[i] = graph.tanh(graph.matmul(previousLayer, this.weights[i]));
      previous = hidden[i];
      previousLayer = hiddenLayers[i];
    }
    console.log(graph);

    const array2d = Array2D.new([hidden[hidden.length - 1], output], this.weightArray[hidden.length]);
    const weight = graph.variable(`w${hidden.length}`, array2d);
    this.outputLayer = graph.matmul(hiddenLayers[hidden.length - 1], weight);
  }

  extractWeights() {
    return this.weightArray;
  }

  extractStructure() {
    return this.structure;
  }

  activate(input) {
    const tensorInput = Array1D.new(input);
    const result = this.session.eval(this.outputLayer, [{ tensor: this.inputLayer, data: tensorInput }]);
    return result.data();
  }
}

export default Network;