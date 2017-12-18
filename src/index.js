import * as Config from './config';
import { MUTATION_RATE } from './config';

export function setUpIndex() {

  // Update the number of blobs
  const blobCanvas = document.getElementById('blobs');
  const blobNumber = document.getElementById('blobs-number');
  const blobCtx = blobCanvas.getContext('2d');
  blobCanvas.width = 1250;
  blobCanvas.height = 100;
  const blobImg = new Image();
  blobImg.onload = () => drawGrid(blobCanvas, blobImg, blobCtx, blobNumber.value);
  Config.NUM_BLOBS = blobNumber.value;
  blobImg.src = "./images/blob.png";
  blobNumber.addEventListener('input', (e) => {
    Config.NUM_BLOBS = e.target.value;
    drawGrid(blobCanvas, blobImg, blobCtx, Number(e.target.value));
  });


  // Update the number of Food elements
  const foodCanvas = document.getElementById('foods');
  const foodNumber = document.getElementById('food-number');
  const foodCtx = foodCanvas.getContext('2d');
  foodCanvas.width = 1250;
  foodCanvas.height = 1000;
  const foodImg = new Image();
  foodImg.onload = () => drawGrid(foodCanvas, foodImg, foodCtx, foodNumber.value);
  foodImg.src = "./images/food.png";
  foodNumber.addEventListener('input', (e) => {
    Config.NUM_FOOD = e.target.value;
    drawGrid(foodCanvas, foodImg, foodCtx, Number(e.target.value));
  });


  // Choose the end setting
  const timeButton = document.getElementById('time-button');
  timeButton.addEventListener('click', (e) => {
    clickEndConditions('DEPTH', timeButton);
  });

  const quantityButton = document.getElementById('quantity-button');
  quantityButton.addEventListener('click', (e) => {
    clickEndConditions('NUM', quantityButton);
  });

  const sizeButton = document.getElementById('size-button');
  sizeButton.addEventListener('click', (e) => {
    clickEndConditions('SIZE', sizeButton);
  });

  // Neural network
  const layersField = document.getElementById('layers');
  const neuronsField = document.getElementById('neurons');

  // export const NETWORK_DIMENSIONS = [10, [16, 16], 2];
  layersField.addEventListener('change', () => {
    const hidden = [];
    for (let i = 0; i < layersField.value; i += 1) {
      hidden.push(Number(neuronsField.value));
    }
    Config.NETWORK_DIMENSIONS = [10, hidden, 2];
  });

  neuronsField.addEventListener('change', () => {
    const hidden = [];
    for (let i = 0; i < layersField.value; i += 1) {
      hidden.push(Number(neuronsField.value));
    }
    Config.NETWORK_DIMENSIONS = [10, hidden, 2];
  });

  // Map size
  // const multiplierField = document.getElementById('multiplier');

  // multiplierField.addEventListener('change', (e) => {
  //   Config.WIDTH = 3700 * e.target.value;
  //   Config.HEIGHT = 2000 * e.target.value;
  // });
  const mutationField = document.getElementById('mutation');

  mutationField.addEventListener('change', (e) => {
    Config.MUTATION_RATE = Number(e.target.value);
  });

  const rangeField = document.getElementById('range');

  rangeField.addEventListener('change', (e) => {
    Config.MUTATION_RANGE = Number(e.target.value);
  });


}


//Helper functions
function drawGrid(canvas, img, ctx, n) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const lineSize = 250 / 5;
  const blobSize = canvas.width / lineSize;
  for (let i = 0; i < n; i += 1) {
    const x = (i % lineSize) * blobSize;
    const y = (Math.floor(i / lineSize)) * blobSize;
    ctx.drawImage(img, x, y, blobSize, blobSize);
  }
}

function clickEndConditions(condition, button) {
  const index = Config.END_CONDITIONS.indexOf(condition);
  if (index > -1) {
    Config.END_CONDITIONS.splice(index, 1);
    button.classList.remove('activated');
  } else {
    button.classList.add('activated');
    Config.END_CONDITIONS.push(condition);
  }
}
