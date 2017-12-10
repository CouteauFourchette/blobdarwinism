import * as SimulationUtil from './simulation_util';

export function checkCollisionWithEntity(objectA, objectB) {
  const distanceX = Math.abs(objectA.position[0] - objectB.position[0]);
  const distanceY = Math.abs(objectA.position[1] - objectB.position[1]);
  const radiusSum = objectA.size + objectB.size;
  if (distanceX < radiusSum && distanceY < radiusSum) {
    return true;
  }
  return false;
}

export function inBoundsPosition(objectA){
  let xPos = objectA.position[0];
  let yPos = objectA.position[1];
  let xRange = [xPos - objectA.size, xPos + objectA.size];
  let yRange = [yPos - objectA.size, yPos + objectA.size];

  if(xRange[0] < 0) xPos = objectA.size;
  else if(xRange[1] > SimulationUtil.WIDTH) xPos = SimulationUtil.WIDTH - objectA.size;
  if(yRange[0] < 0) yPos = objectA.size;
  else if(yRange[1] > SimulationUtil.HEIGHT) yPos = SimulationUtil.HEIGHT - objectA.size;

  return [xPos, yPos];
}
