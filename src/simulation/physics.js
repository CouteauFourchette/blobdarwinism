import * as Config from '../config';

export function checkCollisionWithEntity(objectA, objectB) {
  const distanceX = Math.abs(objectA.position[0] - objectB.position[0]);
  const distanceY = Math.abs(objectA.position[1] - objectB.position[1]);
  const radiusSum = objectA.size + objectB.size;
  if (distanceX < radiusSum && distanceY < radiusSum) {
    return true;
  }
  return false;
}

export function checkCollisionWithWall(objectA) {
  if ((objectA.position[0] - objectA.size) < 0 ||
      (objectA.position[0] + objectA.size) > Config.WIDTH ||
      (objectA.position[1] - objectA.size) < 0 ||
      (objectA.position[1] + objectA.size) > Config.HEIGHT)
  {
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
  else if(xRange[1] > Config.WIDTH) xPos = Config.WIDTH - objectA.size;
  if(yRange[0] < 0) yPos = objectA.size;
  else if(yRange[1] > Config.HEIGHT) yPos = Config.HEIGHT - objectA.size;

  return [xPos, yPos];
}

export function normalizedVectorToEntity(from, to){
  return [
    (to.position[0]/Config.WIDTH - from.position[0]/Config.WIDTH),
    (to.position[1]/Config.HEIGHT - from.position[1]/Config.HEIGHT)
  ];
}

export function normalizedVectorToDistance(vector){
  return (Math.pow((vector[0])*Config.WIDTH, 2) + Math.pow((vector[1])*Config.HEIGHT, 2));
}

export function distanceVectorToWorldSpace(vector){
  return [(vector[0])*Config.WIDTH, (vector[1])*Config.HEIGHT];
}