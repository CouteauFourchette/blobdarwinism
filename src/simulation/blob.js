import * as SimulationUtil from './simulation_util';

class Blob {
  constructor(id, position) {
    this.id = id;
    this.position = position;
    this.color = SimulationUtil.randomColor();
    this.velocity = [0, 0];
    this.acceleration = [0, 0];
    this.size = 1;
    this.alive = true;
  }

  move() {
    this.velocity[0] += this.acceleration[0];
    this.velocity[1] += this.acceleration[1];
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
  }

  accelerate(vector) {
    this.acceleration[0] = vector[0];
    this.acceleration[1] = vector[1];
  }
}

export default Blob;
