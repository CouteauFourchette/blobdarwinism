import * as SimulationUtil from './simulation_util';
import * as Config from '../config';

class Food {
  constructor(id, position) {
    this.id = id;
    this.position = position;
    this.color = SimulationUtil.randomColor();
    this.size = Config.FOOD_SIZE;
  }
}

export default Food;
