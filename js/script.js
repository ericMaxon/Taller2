let canva = document.getElementById("canvas");
let test = document.getElementById("test");
let context = canva.getContext("2d");

canva.addEventListener('mousemove', function(event){
  let x = event.layerX;
  let y = event.layerY;
  const width = canva.width;
  let pixel = context.getImageData(x, y, width, canva.height);
  let {rgba: [r,g,b,a]} = getPixelData(pixel.data, x, y, width);

  const rgba = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  test.style.background = rgba;
  test.textContent = `${rgba} ${x} ${y}`;
  paintPixels(
    context,
    canva,
    155,
    254,
    {
      x,
      y,
      width: canva.width,
      height: canva.height
    })
})

/**
  * Get the pixels vales of a certain region of a image data
  * @param {Array<Number>} imgData
  * @param {Number} x
  * @param {Number} y
  * @param {Number} width
  * @returns {Object}
*/
function getPixelData(imgData, x, y, width){
  //Since in canva the colors are define in a array of pixel
  //which are per each pixel its rgba value occupies one
  //position each one on the pixel array, by this
  //you can obtain the pixel color by this ecuation (x + y * width) * 4
  //so pixelArrayRGBAColor = [r, g, b, a, r1, g1, b1, a1]...
  const index = (x + y * width) * 4;
  const r = imgData[index];
  const g = imgData[index + 1];
  const b = imgData[index + 2];
  const a = imgData[index + 3];
  return {rgba: [r, g, b, a], index};
}
/**
  * Evaluate if the color is part of a boundary
  * @param {Array<Number>} imgData
  * @param {Number} colorToCheck
  * @param {object} pixelData
  * @returns {Boolean}
*/
function isBoundary(colorToCheck, pixelData) {
  const [r, g, b, a] = pixelData;
  return (r === colorToCheck) && (g === colorToCheck) && (b === colorToCheck) && (a === colorToCheck)
}

/**
  * Paints a certain region of pixel with a color
  * @param {CanvaRenderingContext2D} ctx
  * @param {HTMLElement} canva
  * @param {Number} newColor
  * @param {Number} boundaryColor
  * @param {Object} pixelPosition
  * @param {Number} pixelPosition.x
  * @param {Number} pixelPosition.y
  * @param {Number} pixelPosition.width
  * @param {Number} pixelPosition.height
*/
function paintPixels(ctx, canva, newColor, boundaryColor, pixelPosition) {
  const {x, y, width, height} = pixelPosition;

  ctx.drawImage(canva, x, y);

  let pixels = ctx.getImageData(0, 0, 1, 1);
  let pixelData = getPixelData(pixels.data, x, y, 1);
  if(!isBoundary(boundaryColor, pixelData.rgba)){
    [r, g, b, a] = pixelData.rgba
    r = newColor;
    g = newColor;
    b = newColor;
    a = newColor;
    pixels.data[pixelData.index] = r
    pixels.data[pixelData.index + 1] = g
    pixels.data[pixelData.index + 2] = b
    pixels.data[pixelData.index + 3] = a
    ctx.putImageData(pixels, 0, 0);
  }

}
