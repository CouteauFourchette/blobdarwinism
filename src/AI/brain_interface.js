class BrainInterface {
  constructor(blob, network) {
    this.id = blob.id;
    this.fitness = 0;
    if (network) {
      this.network = network;
    } else {
      // Generate network with random weights and given dimensions
    }
  }

  //Overwrite to make intelligent :)
  takeDecision(input) {
    return [(Math.random() - 0.5) / 2, (Math.random() - 0.5) / 2];
  }
}

export default BrainInterface;
