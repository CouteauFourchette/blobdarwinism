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
      this.blobBrains[blob.id].fitness = blob.size + totalTime;
    });
  }
}

export default BlobBrains;
