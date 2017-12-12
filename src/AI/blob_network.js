import BlobBrain from './blob_brain';
import { Architect, Trainer, Network } from 'synaptic';

class BlobNetwork extends BlobBrain {
  constructor(blob, network, dimensions = [8, 4, 2]) {
    super(blob);
    if (network) {
      this.perceptron = network;
    } else {
      this.perceptron = new Architect.Perceptron(...dimensions);
    }
  }

  extractWeights() {
    const jsonPerceptron = this.perceptron.toJSON();
    const connections = Object.keys(jsonPerceptron.connections);
    const weights = connections.map(c => jsonPerceptron.connections[c].weight);
    return weights;
  }

  networkFromWeights(weights) {
    const jsonPerceptron = JSON.parse(this.perceptron.toJSON());
    weights.forEach((weight, idx) => {
      jsonPerceptron.connections[idx].weight = weight;
    });
    return Network.fromJSON(jsonPerceptron);
  }

  takeDecision(input) {
    const positiveVector = this.perceptron.activate(input);
    return [positiveVector[0] - 0.5, positiveVector[1] - 0.5];
  }
}

export default BlobNetwork;
