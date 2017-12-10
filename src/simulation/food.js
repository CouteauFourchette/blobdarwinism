import SimulationUtil from './simulation_util';

class Food {
  constructor(id, position) {
    this.id = id;
    this.position = position;
    this.color = SimulationUtil.randomColor();
  }
}

export default Food;
