import * as SimulationUtil from './simulation_util';

class Food {
  constructor(id, position) {
    this.id = id;
    this.position = position;
    this.color = SimulationUtil.randomColor();
    this.size = SimulationUtil.FOOD_SIZE;
  }
}

export default Food;
