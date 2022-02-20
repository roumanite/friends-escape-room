function getGameEndInfo() {
  const levelCleared = {
    ...textBase,
    text: 'Level Cleared!',
    font: 'normal bold 50px nokia',
    visible: false,
  };
  const gameOver = 
  {
    ...textBase,
    text: 'Game Over',
    font: 'normal bold 50px nokia',
    visible: false,
  };
  let shouldSwitch = false;
  return {
    ...stateBase,
    appendSprites: true,
    sprites: [
      levelCleared,
      gameOver,
    ],
    update: (gameInfo) => {
      if (shouldSwitch) {
        gameInfo.switchState(1);
        shouldSwitch = false;
      } else {
        if (gameInfo.sprites.find(sprite => sprite.state !== undefined && sprite.state === sprite.HAPPY) !== undefined) {
          levelCleared.visible = true;
          levelCleared.x = getHorizontalCenteredPosition(gameInfo.canvas, levelCleared.font, levelCleared.text);
          levelCleared.y = getVerticalCenteredPosition(gameInfo.canvas, levelCleared.font, levelCleared.text);
        } else {
          gameOver.visible = true;
          gameOver.x = getHorizontalCenteredPosition(gameInfo.canvas, gameOver.font, gameOver.text);
          gameOver.y = getVerticalCenteredPosition(gameInfo.canvas, gameOver.font, gameOver.text);
        }
      }
    },
    listeners: {
      'keydown': e => {
        if (e.key === "Enter") {
          shouldSwitch = true;
        }
      },
    },
  }
};