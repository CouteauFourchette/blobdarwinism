class BlobBrain {
  constructor(blob) {
    this.id = blob.id;
    this.fitness = 0;
  }

  //Overwrite to make intelligent :)
  takeDecision(input) {
    return [(Math.random() - 0.5) / 2, (Math.random() - 0.5) / 2];
  }
}

export default BlobBrain;