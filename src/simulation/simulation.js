import { checkCollisionWithWall, checkCollisionWithEntity } from './physics';
import BlobRenderer from '../render/blob_renderer';
import * as SimulationUtil from './simulation_util';
import Blob from './blob';
import Food from './food';

class Simulation {
  constructor(GL) {
    this.entityId = 0;
    this.blobs = [];
    this.food = [];
    this.simulationComplete = false;
    this.generateBlobs();
    this.generateFood();
    this.blobRenderer = new BlobRenderer(GL, this.blobs, this.food);
  }

  generateBlobs() {
    for (let i = 0; i < SimulationUtil.NUM_BLOBS; i++) {
      this.blobs.push(new Blob(this.entityId, SimulationUtil.randomPosition()));
      this.entityId += 1;
    }
  }

  generateFood() {
    for (let i = 0; i < SimulationUtil.NUM_FOOD; i++) {
      this.food.push(new Food(this.entityId, SimulationUtil.randomPosition()));
      this.entityId += 1;
    }
  }

  moveBlobs() {
    this.blobs.forEach(blob => {
      blob.accelerate([(Math.random() - 0.5) / 2, (Math.random() - 0.5) / 2]); //Temporary random acceleration
      const oldPosition = JSON.parse(JSON.stringify(blob.position));
      blob.move();
      if (checkCollisionWithWall(blob)) {
        blob.position = oldPosition;
      }
    });
  }

  eat() {
    this.blobs.forEach(blob => {
      
    }
  }

  run() {
    this.simulate();
  }

  simulate() {
    this.moveBlobs();
    this.blobRenderer.updateBlobs(this.blobs);
    this.blobRenderer.render();
    if (!this.simulationComplete) {
      requestAnimationFrame(this.simulate.bind(this));
    }
  }
}

export default Simulation;
