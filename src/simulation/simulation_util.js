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

export function closestConsumable(blob, blobs, food){
  let closestDistance = Infinity;
  let returnConsumable = undefined;
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
  let returnPredator = undefined;
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