import { inBoundsPosition, checkCollisionWithEntity, checkCollisionWithWall } from './physics';
import BlobRenderer from '../render/blob_renderer';
import BlobBrains from '../AI/blob_brains';
import Genetic from '../AI/genetics';
import Network from '../AI/network';
import * as SimulationUtil from './simulation_util';
import * as Config from '../config';
import Blob from './blob';
import Food from './food';

class Simulation {
  constructor(GL) {
    this.entityId = 0;
    this.blobs = [];
    this.food = [];
    this.renderSimulation = true;
    this.simulationDepth = 0;
    this.simulationComplete = false;
    this.generateBlobs();
    this.generateFood();
    this.blobRenderer = new BlobRenderer(GL, this.blobs, this.food);
    this.blobBrains = Genetic.newGeneration(this.blobs);
    window.reset = this.manualReset.bind(this);
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

  newGeneration() {
    this.generateBlobs();
    this.blobBrains = Genetic.newGeneration(this.blobs, this.blobBrains);
  }

  initTimes(){
    this.totalTime = 0;
    this.deltaTime = 0;
    this.lastUpdate = Date.now();
  }

  updateTimes(){
    let newTime = Date.now();
    this.deltaTime = (newTime - this.lastUpdate)/1000;
    if (this.deltaTime === 0) { this.deltaTime = 0.001; }
    this.lastUpdate = newTime;
    this.totalTime += this.deltaTime;
  }

  getInputs(blob, inputTypes) {
    let inputs = [];
    const largestBlob = SimulationUtil.getLargestBlob(this.blobs);
    inputTypes.forEach(inputType => {
      switch(inputType) {
        case "SIZE":
          inputs.push(blob.size/largestBlob);
          break;
        case "POS":
          const x = 2 * blob.position[0] / Config.WIDTH - 1;
          const y = 2 * blob.position[1] / Config.HEIGHT - 1;
          inputs.push(x);
          inputs.push(y);
          break;
        case "VEL":
          inputs.push(blob.velocity[0] / Config.MAX_SPEED);
          inputs.push(blob.velocity[1] / Config.MAX_SPEED);
          break;
        case "CONS":
          const cons = SimulationUtil.closestConsumable(blob, this.blobs, this.food);
          inputs = inputs.concat(cons);
          break;
        case "PRED":
          const pred = SimulationUtil.closestPredator(blob, this.blobs);
          inputs = inputs.concat(pred);
          break;
        case "FOOD":
          const food = SimulationUtil.closestFood(blob, this.food);
          inputs = inputs.concat(food);
          break;
        case "BLOB":
          const otherBlob = SimulationUtil.closestBlob(blob, this.blobs);
          inputs = inputs.concat(otherBlob);
          break;
      }
    });
    return inputs;
  }

  moveBlobs() {
    this.blobs.forEach(blob => {
      const inputs = this.getInputs(blob, Config.INPUTS);
      const acceleration = this.blobBrains.takeDecision(blob, inputs);
      blob.accelerate(acceleration);
      blob.move(this.deltaTime);
      // blob.position = inBoundsPosition(blob);
      if(checkCollisionWithWall(blob)){
        this.blobs = this.blobs.filter(otherBlob => otherBlob.id !== blob.id);
        this.blobRenderer.removeBlob(blob.id);
      }
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
          } else if (this.blobs[i].size < this.blobs[j].size) {
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

  manualReset(){
    this.simulationComplete = true;
  }

  reset() {
    this.simulationDepth = 0;
    this.generateFood();
    this.newGeneration(); // invokes this.generateBlobs() internally
    if (this.renderSimulation) {
      this.blobRenderer.removeAllRenderObjects();
      this.blobRenderer.addBlobsAndFood(this.blobs, this.food);
    }
    this.simulationComplete = false;
    this.run();
  }

  updateSimulationStatus(conditions) {
    let result = false;
    conditions.forEach(condition => {
      if (result) { return; }
      switch(condition) {
        case 'TIME':
          result = result || this.totalTime > Config.TIME_THRESHOLD;
          break;
        case 'NUM':
          result = result || this.blobs.length < Config.NUM_THRESHOLD;
          break;
        case 'SIZE':
          const largestBlobSize = SimulationUtil.getLargestBlob(this.blobs);
          result = result || largestBlobSize > Config.SIZE_THRESHOLD;
          break;
        case 'DEPTH':
          // console.log("simulationDepth: ", this.simulationDepth);
          result = result || this.simulationDepth > Config.DEPTH_THRESHOLD;
          break;
      }
    });
    this.simulationComplete = result;
  }

  simulate() {
    this.simulationDepth += 1;
    this.updateTimes();
    this.eat();
    this.moveBlobs();
    this.blobBrains.updateBlobs(this.blobs, this.totalTime);
<<<<<<< HEAD
    this.blobRenderer.updateBlobs(this.blobs);
    this.blobRenderer.render(this.totalTime);
    if (!this.simulationComplete) {
      requestAnimationFrame(this.simulate.bind(this));
    } else {
=======
    if (this.renderSimulation) {
      this.blobRenderer.updateBlobs(this.blobs);
      this.blobRenderer.render();
    }
    if (this.simulationComplete) {
>>>>>>> config
      console.log("Simulation complete.");
      this.reset();
    } else {
      setTimeout(this.simulate.bind(this), 0);
      // setInterval(this.simulate.bind(this), 0);
    }
    this.updateSimulationStatus(Config.END_CONDITIONS);
  }
}

export default Simulation;
