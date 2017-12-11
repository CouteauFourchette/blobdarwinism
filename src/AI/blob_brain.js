class BlobBrain {
  constructor(blob) {
    this.id = blob.id;
  }

  //Overwrite to make intelligent :)
  takeDecision(input) {
    return [(Math.random() - 0.5) / 2, (Math.random() - 0.5) / 2];
  }
}

export default BlobBrain;