import BlobRenderer from '../render/blob_renderer';
import SimulationUtil from './simulation_util';

class Simulation {
  constructor(GL) {
    this.blobs = SimulationUtil.generateBlobs();
    this.food = SimulationUtil.generateFood();
    this.simulationComplete = false;
    this.blobRenderer = new BlobRenderer(GL, this.blobs, this.food);
  }

  moveBlobs() {
    this.blobs.forEach(blob => blob.move());
  }

  run() {
    this.simulate();
  }

  simulate() {
    this.moveBlobs();
    this.blobRenderer.render();
    if (!this.simulationComplete) {
      this.simulate();
    }
  }
}

export default Simulation;
