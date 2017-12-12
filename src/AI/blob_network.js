import BlobBrain from './blob_brain';
import { Architect, Trainer } from 'synaptic';

class BlobNetwork extends BlobBrain {
  constructor(dimensions = [8, 4, 2]) {
    super({id: 1});
    this.perceptron = new Architect.Perceptron(...dimensions);
    // this.trainer = new Trainer(this.perceptron);
  }

  extractAllWeights(layers) {
    const weights = [];
    layers.forEach(layer => {
      weights.concat(this.extractWeights(layer));
    });
    return weights;
  }

  extractWeights(layer) {
    // debugger;
    const connections = layer.connectedTo[0].connections;
    const weights = Object.keys(connections).map(key => {
      return connections[key].weight;
    });
    return weights;
  }

  setAllWeights(layers, weights) {
    let start = 0;
    let numWeights = 0;
    layers.forEach(layer => {
      numWeights = Object.keys(layer.connectedTo[0].connections).length;
      this.setWeights(layer, weights.slice(start, start + numWeights));
      start = weightCount;
    });
  }

  setWeights(layer, weights) {
    const connections = layer.connectedTo[0].connections;
    Object.keys(connections).forEach((key, idx) => {
      connections[key].weight = weights[idx];
    });
  }

  getInputLayer(){
    return this.perceptron.layers.input;
  }

  getHiddenLayer(depth = 0) {
    return this.perceptron.layers.hidden[depth];
  }

  getOutputLayer() {
    return this.perceptron.layers.output;
  }
}

export default BlobNetwork;
