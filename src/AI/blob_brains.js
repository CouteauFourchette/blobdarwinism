import BlobBrain from './blob_brain';
import { SIZE_FACTOR, TIME_FACTOR } from '../config';

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
      const fitness = Math.pow((SIZE_FACTOR * blob.size + TIME_FACTOR * totalTime), 2);
      this.blobBrains[blob.id].fitness = fitness;
    });
  }
}

export default BlobBrains;
