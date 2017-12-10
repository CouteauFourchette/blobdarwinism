import * as SimulationUtil from './simulation_util';

export function checkCollisionWithWall(objectA) {
  if ((objectA.position[0] - objectA.size) < 0 ||
      (objectA.position[0] + objectA.size) > SimulationUtil.WIDTH ||
      (objectA.position[1] - objectA.size) < 0 ||
      (objectA.position[1] + objectA.size) > SimulationUtil.HEIGHT)
  {
    return true;
  }
  return false;
}

export function checkCollisionWithEntity(objectA, objectB) {
  const distanceX = objectA.position[0] - objectA.position[0];
  const distanceY = objectA.position[1] - objectA.position[1];
  const radiusSum = objectA.size + objectB.size;
  if (distanceX < radiusSum || distanceY < radiusSum) {
    return true;
  }
  return false;
}
