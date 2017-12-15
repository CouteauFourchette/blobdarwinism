document.addEventListener('DOMContentLoaded', ()=>{


  const blobCanvas = document.getElementById('blobs');
  const blobNumber = document.getElementById('blobs-number');
  const blobCtx = blobCanvas.getContext('2d');
  blobCanvas.width = 1250;
  blobCanvas.height = 200;
  const blobImg = new Image();
  blobImg.onload = () => drawGrid(blobCanvas, blobImg, blobCtx, blobNumber.value);
  blobImg.src = "./images/blob.png";
  blobNumber.addEventListener('input', (event) => {
    drawGrid(blobCanvas, blobImg, blobCtx, Number(event.target.value));
  });

  const foodCanvas = document.getElementById('foods');
  const foodNumber = document.getElementById('food-number');
  const foodCtx = foodCanvas.getContext('2d');
  foodCanvas.width = 1250;
  foodCanvas.height = 1200;
  const foodImg = new Image();
  foodImg.onload = () => drawGrid(foodCanvas, foodImg, foodCtx, blobNumber.value);
  foodImg.src = "./images/food.png";
  foodNumber.addEventListener('input', (event) => {
    drawGrid(foodCanvas, foodImg, foodCtx, Number(event.target.value));
  });
});

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