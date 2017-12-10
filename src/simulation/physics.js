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
  const distanceX = Math.abs(objectA.position[0] - objectB.position[0]);
  const distanceY = Math.abs(objectA.position[1] - objectB.position[1]);
  const radiusSum = objectA.size + objectB.size;
  if (distanceX < radiusSum && distanceY < radiusSum) {
    return true;
  }
  return false;
}
