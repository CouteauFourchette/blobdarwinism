export const NUM_BLOBS = 20;
export const NUM_FOOD = 50;
export const WIDTH = 800;
export const HEIGHT = 600;
export const MAX_SPEED = 10;
export const FOOD_SIZE = 5;

export function randomVector() {
  return [Math.random(), Math.random()];
}

export function randomPosition() {
  const position = randomVector();
  position[0] = Math.floor(WIDTH * position[0]);
  position[1] = Math.floor(HEIGHT * position[1]);
  return position;
}

export function randomColor() {
  return [Math.random(), Math.random(), Math.random(), 1];
}