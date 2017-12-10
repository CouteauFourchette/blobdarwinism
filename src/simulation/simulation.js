import BlobRenderer from '../render/blob_renderer';
import SimulationUtil from './simulation_util';
import Blob from './blob';
import Food from './food';

class Simulation {
  constructor(GL) {
    this.blobs = this.generateBlobs();
    this.food = this.generateFood();
    this.simulationComplete = false;
    this.blobRenderer = new BlobRenderer(GL, this.blobs, this.food);
  }

  generateBlobs() {
    for (let i = 0; i < SimulationUtil.NUM_BLOBS; i++) {
      this.blobs.push(new Blob(i, SimulationUtil.randomPosition()));
    }
  }

  generateFood() {
    for (let i = 0; i < SimulationUtil.NUM_FOOD; i++) {
      this.blobs.push(new Food(i, SimulationUtil.randomPosition()));
    }
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
