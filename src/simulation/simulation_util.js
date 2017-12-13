import * as Config from '../config';
import {normalizedVectorToEntity, normalizedVectorToDistance} from './physics';

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

export function getLargestBlob(blobs){
  return blobs.map(blob => blob.size).reduce(
    (a, b) => Math.max(a, b)
  );
}

export function closestConsumable(blob, blobs, food){
  let closestDistance = Infinity;
  let returnConsumable = [0,0,0];
  blobs.concat(food).forEach((entity) => {
    if(blob.id === entity.id || blob.size <= entity.size) return;
    let vector = normalizedVectorToEntity(blob, entity);
    let distance = normalizedVectorToDistance(vector);
    if(distance < closestDistance) {
      returnConsumable = [vector[0], vector[1], entity.size];
      closestDistance = distance;
    }
  });
  return returnConsumable;
}

export function closestPredator(blob, blobs){
  let closestDistance = Infinity;
  let returnPredator = [0,0,0];
  blobs.forEach((entity) => {
    if(blob.id === entity.id || blob.size >= entity.size) return;
    let vector = normalizedVectorToEntity(blob, entity);
    let distance = normalizedVectorToDistance(vector);
    if(distance < closestDistance) {
      returnPredator = [vector[0], vector[1], entity.size];
      closestDistance = distance;
    }
  });
  return returnPredator;
}

export function closestBlob(blob, blobs) {
  let closestDistance = Infinity;
  let returnBlob = [0, 0, 0];
  blobs.forEach((otherBlob) => {
    if (blob.id === otherBlob.id) { return; }
    let vector = normalizedVectorToEntity(blob, otherBlob);
    let distance = normalizedVectorToDistance(vector);
    if(distance < closestDistance) {
      returnBlob = [vector[0], vector[1], otherBlob.size];
      closestDistance = distance;
    }
  });
  return returnBlob;
}

export function closestFood(blob, foods) {
  let closestDistance = Infinity;
  let returnFood = [0, 0, 0];
  foods.forEach((food) => {
    let vector = normalizedVectorToEntity(blob, food);
    let distance = normalizedVectorToDistance(vector);
    if(distance < closestDistance) {
      returnFood = [vector[0], vector[1]];
      closestDistance = distance;
    }
  });
  return returnFood;
}
