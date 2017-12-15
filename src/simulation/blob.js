import * as SimulationUtil from './simulation_util';
import * as Config from '../config';

class Blob {
  constructor(id, position) {
    this.id = id;
    this.position = position;
    this.color = SimulationUtil.randomColor();
    this.velocity = [0, 0];
    this.acceleration = [0, 0];
    this.size = Config.INITIAL_BLOB_SIZE;
    this.alive = true;
  }

  move(deltaTime) {
    this.velocity[0] += this.acceleration[0];
    this.velocity[1] += this.acceleration[1];
    if (Math.abs(this.velocity[0]) > Config.MAX_SPEED) {
      this.velocity[0] = Config.MAX_SPEED * Math.sign(this.velocity[0]);
    }
    if (Math.abs(this.velocity[1]) > Config.MAX_SPEED) {
      this.velocity[1] = Config.MAX_SPEED * Math.sign(this.velocity[1]);
    }
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
  }

  eat(blob) {
    this.size += (blob.size / 2);
  }

  accelerate(vector) {
    this.acceleration[0] = vector[0];
    this.acceleration[1] = vector[1];
  }
}

export default Blob;
