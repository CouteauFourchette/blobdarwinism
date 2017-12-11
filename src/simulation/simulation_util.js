import * as Config from '../config';

export function randomVector() {
  return [Math.random(), Math.random()];
}

export function randomPosition() {
  const position = randomVector();
  position[0] = Math.floor(Config.WIDTH * position[0]);
  position[1] = Math.floor(Config.HEIGHT * position[1]);
  return position;
}

export function randomColor() {
  return [Math.random(), Math.random(), Math.random(), 1];
}

export function closestConsumable(blob, blobs, food){
  
}

export function closestPredator(blob, blobs){

}

export function closestPrey(blob, blobs){

}