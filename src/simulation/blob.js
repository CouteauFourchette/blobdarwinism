import SimulationUtil from './simulation_util';

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
    this.accelerate();
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
  }

  accelerate() {
    this.velocity[0] += this.acceleration[0];
    this.velocity[1] += this.acceleration[1];
  }
}

export default Blob;
