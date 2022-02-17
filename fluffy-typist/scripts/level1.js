function getLevel1Info(gameInfo) {
  return {
    ...stateBase,
    sprites: [{
      ...rectBase,
      color: Colors.LEMON,
      width: gameInfo.canvas.width,
      height: gameInfo.canvas.height,
    }],
  }
}