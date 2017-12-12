import BlobNetwork from './blob_network';

class BlobBrains {
  constructor(blobs) {
    this.blobBrains = {};
    blobs.forEach(blob => this.addBlob(blob));
  }

  takeDecision(blob, input) {
    const blobBrain = this.blobBrains[blob.id];
    return blobBrain.takeDecision(input);
  }

  addBlob(blob) {
    this.blobBrains[blob.id] = new BlobNetwork(blob);
  }

  removeBlob(blob) {
    delete this.blobBrains[blob.id];
  }
}

export default BlobBrains;