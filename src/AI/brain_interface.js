class BrainInterface {
  constructor(blob, network) {
    this.id = blob.id;
    this.color = blob.color;
    this.fitness = 0;
    if (network) {
      this.network = network;
    }
  }

  //Overwrite to make intelligent :)
  takeDecision(input) {
    return [(Math.random() - 0.5) / 2, (Math.random() - 0.5) / 2];
  }
}

export default BrainInterface;
