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
    this.generationComplete = false;
    this.generateBlobs();
    this.generateFood();
    this.blobRenderer = new BlobRenderer(GL, this.blobs, this.food);
    this.blobBrains = Genetic.newGeneration(this.blobs);
    window.simulateNextGeneration = this.manualReset.bind(this);
    console.log("Configuration: ", Config);
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
    this.blobs.forEach((blob) =>{
      blob.color = this.blobBrains.blobBrains[blob.id].color;
    });
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
          const cons = SimulationUtil.closestConsumable(
            blob, this.blobs, this.food);
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
        this.blobBrains.blobBrains[blob.id].fitness /= 5;
        this.blobRenderer.removeBlob(blob.id);
      }
    });
  }

  eat() {
    //Blobs
    // for (let i = this.blobs.length - 1; i >= 0; i -= 1) {
    //   for (let j = (i - 1); j >= 0; j -= 1) {
    //     if (this.blobs[i] && checkCollisionWithEntity(this.blobs[i], this.blobs[j])) {
    //       if (this.blobs[i].size > this.blobs[j].size) {
    //         this.blobs[i].eat(this.blobs[j]);
    //         this.blobRenderer.removeBlob(this.blobs[j].id);
    //         this.blobBrains.blobBrains[this.blobs[j].id].fitness /= 2;
    //         this.blobs.splice(j, 1);
    //       } else if (this.blobs[i].size < this.blobs[j].size) {
    //         this.blobs[j].eat(this.blobs[i]);
    //         this.blobRenderer.removeBlob(this.blobs[i].id);
    //         this.blobBrains.blobBrains[this.blobs[i].id].fitness /= 2;
    //         this.blobs.splice(i, 1);
    //       }
    //     }
    //   }
    // }
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
    this.generationComplete = true;
  }

  simulateNextGeneration() {
    this.simulationDepth = 0;
    this.generateFood();
    this.newGeneration(); // invokes this.generateBlobs() internally
    if (this.renderSimulation) {
      this.blobRenderer.removeAllRenderObjects();
      this.blobRenderer.addBlobsAndFood(this.blobs, this.food);
    }
    this.generationComplete = false;
    this.run();
  }

  stop() {
    this.blobRenderer.removeAllRenderObjects();
    this.blobs = [];
    this.food = [];
    this.blobBrains = null;
    this.blobRenderer = null;
  }

  updateGenerationStatus(conditions) {
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
          result = result || this.simulationDepth > Config.DEPTH_THRESHOLD;
          break;
      }
    });
    this.generationComplete = result;
  }

  simulate() {
    try {
      if (this.generationComplete) {
        console.log("Generation complete.");
        this.simulateNextGeneration();
        return;
      }
      this.simulationDepth += 1;
      this.updateTimes();
      this.eat();
      this.moveBlobs();
      this.blobBrains.updateBlobs(this.blobs, this.totalTime);
      if (this.renderSimulation) {
        this.blobRenderer.updateBlobs(this.blobs);
        this.blobRenderer.render(this.totalTime);
      }
      this.updateGenerationStatus(Config.END_CONDITIONS);
      setTimeout(this.simulate.bind(this), 0);
    } catch (e) {
      // Forgive me father for I have sinned.
      console.log(e);
    }
  }
}

export default Simulation;
