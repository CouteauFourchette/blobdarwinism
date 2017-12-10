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
    for (let i = this.blobs.length - 1; i >= 0; i -= 1) {
      for (let j = (i - 1); j >= 0; j -= 1) {
        if (this.blobs[i] && checkCollisionWithEntity(this.blobs[i], this.blobs[j])) {
          if (this.blobs[i].size > this.blobs[j].size) {
            this.blobs[i].eat(this.blobs[j]);
            this.blobRenderer.removeBlob(this.blobs[j].id);
            this.blobs.splice(j, 1);
          } else if (this.blobs[i].size <= this.blobs[j].size) {
            this.blobs[j].eat(this.blobs[i]);
            this.blobRenderer.removeBlob(this.blobs[i].id);
            this.blobs.splice(i, 1);
          }
        }
      }
    }
  }

  run() {
    this.simulate();
  }

  simulate() {
    this.moveBlobs();
    this.eat();
    this.blobRenderer.updateBlobs(this.blobs);
    this.blobRenderer.render();
    if (!this.simulationComplete) {
      requestAnimationFrame(this.simulate.bind(this));
    }
  }
}

export default Simulation;
