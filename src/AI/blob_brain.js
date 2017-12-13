import BrainInterface from './brain_interface';

class BlobBrain extends BrainInterface {
  constructor(blob, network) {
    super(blob, network);
  }

  getNetwork() {
    return this.network;
  }

  setNetwork(network) {
    this.network = network;
  }

  takeDecision(input) {
    // return [(Math.random() * 2) - 1, (Math.random() * 2) - 1];
    return this.network.activate(input);
    // return 
  }
}

export default BlobBrain;
