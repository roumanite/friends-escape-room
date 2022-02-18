loadTilesheet = (filename, loadHandler) => {
  const tilesheet = new Image();
  tilesheet.addEventListener("load", loadHandler, false);
  tilesheet.src = filename;
  return tilesheet;
}

loadFont = (filename, nickname, loadHandler) => {
  new FontFace(nickname, `url(${filename})`).load().then(loadHandler);
}