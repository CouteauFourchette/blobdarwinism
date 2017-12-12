import { inBoundsPosition, checkCollisionWithEntity } from './physics';
import BlobRenderer from '../render/blob_renderer';
import BlobBrains from '../AI/blob_brains';
import Genetic from '../AI/genetics';
import * as SimulationUtil from './simulation_util';
import * as Config from '../config';
import Blob from './blob';
import Food from './food';

class Simulation {
  constructor(GL) {
    this.entityId = 0;
    this.blobs = [];
    this.food = [];
    this.endCondition = 'TIME'; // Must be one of TIME, SIZE, NUM
    this.simulationComplete = false;
    this.generateBlobs();
    this.generateFood();
    this.blobRenderer = new BlobRenderer(GL, this.blobs, this.food);
    this.blobBrains = new BlobBrains(this.blobs);
  }

  generateBlobs() {
    this.blobs = [];
    for (let i = 0; i < Config.NUM_BLOBS; i++) {
      this.blobs.push(new Blob(this.entityId, SimulationUtil.randomPosition()));
      this.entityId += 1;
    }
  }

  generateFood() {
    this.food = [];
    for (let i = 0; i < Config.NUM_FOOD; i++) {
      this.food.push(new Food(this.entityId, SimulationUtil.randomPosition()));
      this.entityId += 1;
    }
  }

  initTimes(){
    this.totalTime = 0;
    this.deltaTime = 0;
    this.lastUpdate = Date.now();
  }

  updateTimes(){
    let newTime = Date.now();
    this.deltaTime = (newTime - this.lastUpdate)/1000;
    this.lastUpdate = newTime;
    this.totalTime += this.deltaTime;
  }

  moveBlobs() {
    this.blobs.forEach(blob => {
      const acceleration = this.blobBrains.takeDecision(blob, [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]);
      blob.accelerate(acceleration);
      blob.move(this.deltaTime);
      blob.position = inBoundsPosition(blob);
    });
  }

  eat() {
    //Blobs
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
    //Food
    for (let i = this.blobs.length - 1; i >= 0; i -= 1) {
      for (let j = this.food.length - 1; j >= 0; j -= 1) {
        if (checkCollisionWithEntity(this.blobs[i], this.food[j])) {
          this.blobs[i].eat(this.food[j]);
          this.blobRenderer.removeBlob(this.food[j].id);
          this.food.splice(j, 1);
        }
      }
    }
  }

  run() {
    this.initTimes();
    this.simulate();
  }

  reset() {
    this.blobRenderer.removeAllRenderObjects();
    this.generateBlobs();
    this.generateFood();
    this.blobBrains = new BlobBrains(this.blobs);
    this.blobRenderer.addBlobsAndFood(this.blobs, this.food);
    this.simulationComplete = false;
    this.run();
  }

  updateSimulationStatus(condition) {
    let result;
    switch(condition) {
      case 'TIME':
        result = this.totalTime > Config.TIME_THRESHOLD;
        break;
      case 'NUM':
        console.log("num blobs remaining:", this.blobs.length);
        result = this.blobs.length < Config.NUM_THRESHOLD;
        break;
      case 'SIZE':
        const largestBlobSize = this.blobs.map(blob => blob.size).reduce(
          (a, b) => Math.max(a, b)
        );
        console.log("current largest blob: ", largestBlobSize);
        result = largestBlobSize > Config.SIZE_THRESHOLD;
        break;
      default:
        result = false;
    }
    this.simulationComplete = result;
  }

  simulate() {
    this.updateTimes();
    this.eat();
    this.moveBlobs();
    this.blobBrains.updateBlobs(this.blobs, this.totalTime);
    this.blobRenderer.updateBlobs(this.blobs);
    this.blobRenderer.render();
    this.updateSimulationStatus(this.endCondition);
    if (!this.simulationComplete) {
      requestAnimationFrame(this.simulate.bind(this));
    } else {
      // simulation over
      console.log("Simulation complete.");
      this.reset();
    }
  }
}

export default Simulation;
