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

  //Overwrite to make intelligent :)
  takeDecision(input) {
    // return this.network.activate(input)
  }
}

export default BlobBrain;
