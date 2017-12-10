class SimulationUtil {
  randomVector() {
    return [Math.random(), Math.random()];
  }

  randomPosition() {
    const position = randomVector();
    position[0] = Math.floor(SimulationUtil.WIDTH * position[0]);
    position[1] = Math.floor(SimulationUtil.HEIGHT * position[1]);
    return position;
  }

  randomColor() {
    return [Math.random(), Math.random(), Math.random(), 1];
  }
}

SimulationUtil.NUM_BLOBS = 10;
SimulationUtil.NUM_FOOD = 4;
SimulationUtil.WIDTH = 800;
SimulationUtil.HEIGHT = 600;

export default SimulationUtil;
