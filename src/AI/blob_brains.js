import BlobBrain from './blob_brain';

class BlobBrains {
  constructor(blobs) {
    this.blobBrains = {};
    blobs.forEach(blob => this.addBlob(blob));
  }

  allBrains() {
    return Object.keys(this.blobBrains).map(key => this.blobBrains[key]);
  }

  takeDecision(blob, input) {
    const blobBrain = this.blobBrains[blob.id];
    return blobBrain.takeDecision(input);
  }

  addBlob(blob) {
    const blobNetwork = new BlobBrain(blob);
    this.blobBrains[blob.id] = blobNetwork;
  }

  removeBlob(blob) {
    delete this.blobBrains[blob.id];
  }

  updateBlobs(blobs, totalTime) {
    blobs.forEach(blob => {
      this.blobBrains[blob.id].fitness = 2*blob.size + totalTime;
      console.log(`blob.id: ${blob.id},
         blob.size: ${blob.size},
         totalTime: ${totalTime},
         fitness: ${this.blobBrains[blob.id].fitness}`);
    });
  }
}

export default BlobBrains;
