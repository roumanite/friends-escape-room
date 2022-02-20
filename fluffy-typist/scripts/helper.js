loadTilesheet = (filename, loadHandler) => {
  const tilesheet = new Image();
  tilesheet.addEventListener("load", loadHandler, false);
  tilesheet.src = filename;
  return tilesheet;
}

loadFont = (filename, nickname, loadHandler) => {
  new FontFace(nickname, `url(${filename})`).load().then(loadHandler);
}

getTextWidth = (canvas, font, word) => {
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  return ctx.measureText(word).width;
}

getHorizontalCenteredPosition = (canvas, font, word) => {
  return canvas.width/2 - getTextWidth(canvas, font, word)/2;
}

getVerticalCenteredPosition = (canvas, font, word) => {
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  const metrics = ctx.measureText(word);
  const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  return canvas.height/2 - actualHeight/2;
}