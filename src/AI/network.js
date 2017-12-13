import { Graph, Array1D, Array2D, NDArrayMathCPU, Session } from 'deeplearn';

const math = new NDArrayMathCPU();

class Network {
  constructor(input, hidden, output, weights) {
    math.scope((keep, track) => {
      const graph = new Graph();
      this.session = keep(new Session(graph, math));
      this.arrays = [];
      this.inputLayer = graph.placeholder('input', [input]);
      this.structure = [input, hidden, output];

      if (weights) {
        this.weightArray = weights;
      } else {
        // Randomly initialize weights
        let previous = input;
        this.weightArray = [];
        for (let i = 0; i < hidden.length; i += 1) {
          const randomWeights = [...new Array(previous * hidden[i])].map(() => 2*Math.random()-1);
          this.weightArray.push(randomWeights);
          previous = hidden[i];
        }
        const randomWeights = [...new Array(output * hidden[hidden.length - 1])].map(() => 2*Math.random()-1);
        this.weightArray.push(randomWeights);
      }


      this.weights = {};
      const hiddenLayers = {};
      let previous = input;
      let previousLayer = this.inputLayer;
      for (let i = 0; i < hidden.length; i += 1) {
        const array2d = keep(Array2D.new([previous, hidden[i]], this.weightArray[i]));
        this.arrays.push(array2d);
        this.weights[i] = graph.variable(`w${i}`, array2d);
        hiddenLayers[i] = graph.tanh(graph.matmul(previousLayer, this.weights[i]));
        previous = hidden[i];
        previousLayer = hiddenLayers[i];
      }

      const array2d = keep(Array2D.new([hidden[hidden.length - 1], output], this.weightArray[hidden.length]));
      const weight = graph.variable(`w${hidden.length}`, array2d);
      this.arrays.push(array2d);
      this.outputLayer = graph.matmul(hiddenLayers[hidden.length - 1], weight);
    });
  }

  extractWeights() {
    return this.weightArray;
  }

  extractStructure() {
    return this.structure;
  }

  activate(input) {
    math.startScope();
    const tensorInput = Array1D.new(input);
    const result = this.session.eval(this.outputLayer, [{ tensor: this.inputLayer, data: tensorInput }]);
    let resultData = result.dataSync();
    math.endScope();
    return resultData;
  }

  delete() {
    this.arrays.forEach((arr)=> {
      arr.dispose();
    });
    this.session.dispose();
  }
}

export default Network;