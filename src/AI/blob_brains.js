import BlobBrain from './blob_brain';
import { DEGREE, SIZE_FACTOR, TIME_FACTOR } from '../config';

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
      this.blobBrains[blob.id].fitness =
      Math.pow((SIZE_FACTOR * blob.size), DEGREE) *
      Math.pow((TIME_FACTOR * totalTime), DEGREE);
    });
  }
}

export default BlobBrains;
