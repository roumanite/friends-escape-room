function getGameEndInfo(ts1, ts2) {
  const messageBackground = createSprite({
    type: Types.RECTANGULAR,
    visible: true,
    color: transparentize(Colors.DARK_ORANGE, 0.8),
  });
  const gameEndMsg = createSprite({
    type: Types.TEXT,
    text: 'Restaurant Menu finished!',
    font: 'normal bold 50px nokia',
    color: Colors.DARK_BROWN,
    visible: true,
  });
  const gameEndDesc1 = createSprite({
    type: Types.TEXT,
    text: 'Fluffy is grateful for your help!',
    font: 'normal bold 30px nokia',
    color: Colors.DARK_BROWN,
    visible: true,
  });
  const gameEndDesc2 = createSprite({
    type: Types.TEXT,
    text: 'PRESS Enter to restart the game',
    font: 'normal bold 30px nokia',
    color: Colors.DARK_BROWN,
    visible: true,
  });
  const story3 = createSprite({
    type: Types.IMAGE,
    img: ts1,
    states: {
      INITIAL: {
        x: 0,
        y: 0,
        sourceX: 0,
        sourceY: 0,
        sourceWidth: ts1.width,
        sourceHeight: ts1.height,
        delta: -0.004,
      }
    }
  });
  const story4 = createSprite({
    type: Types.IMAGE,
    img: ts2,
    states: {
      INITIAL: {
        x: 0,
        y: 0,
        alpha: 0,
        sourceX: 0,
        sourceY: 0,
        sourceWidth: ts2.width,
        sourceHeight: ts2.height,
      },
    }
  });
  let shouldSwitch = false;
  return {
    ...stateBase,
    sprites: [
      story3,
      story4,
      messageBackground,
      gameEndMsg,
      gameEndDesc1,
      gameEndDesc2,
    ],
    update: (gameInfo) => {
      if (shouldSwitch) {
        gameInfo.switchState(1);
        shouldSwitch = false;
      } else {
        messageBackground.width = 0.75 * gameInfo.canvas.width;
        messageBackground.height = 0.75 * gameInfo.canvas.height;
        messageBackground.x = centerSpriteHorizontally(gameInfo.canvas, messageBackground);
        messageBackground.y = centerSpriteVertically(gameInfo.canvas, messageBackground);
        gameEndMsg.x = centerSpriteHorizontally(gameInfo.canvas, gameEndMsg);
        gameEndMsg.y = centerSpriteVertically(gameInfo.canvas, gameEndMsg);
        gameEndDesc1.x = centerSpriteHorizontally(gameInfo.canvas, gameEndDesc1);
        gameEndDesc1.y = gameEndMsg.y + 70;
        gameEndDesc2.x = centerSpriteHorizontally(gameInfo.canvas, gameEndDesc2);
        gameEndDesc2.y = gameEndDesc1.y + 50;
        [story3, story4].forEach(story => {
          story[story.state].scale = gameInfo.canvas.width/story.img.width;
          story[story.state].alpha = Math.max(0, Math.min(1, story[story.state].alpha + story[story.state].delta));
          if (story[story.state].alpha <= 0 || story[story.state].alpha >= 1){
            story[story.state].delta = -story[story.state].delta;
          }
        });
        if (story3[story3.state].alpha >= 0.3 && story4[story4.state].delta === 0) {
          story4[story4.state].delta = 0.004;
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