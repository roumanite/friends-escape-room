function getGameEndInfo(ts1, ts2) {
  const gameEndMsg = {
    ...textBase,
    text: 'Restaurant Menu finished!',
    font: 'normal bold 50px nokia',
    visible: true,
  };
  const story3 = {
    ...artBase,
    img: ts1,
    [artBase.INITIAL]: {
      ...artBase[artBase.INITIAL],
      x: 0,
      y: 0,
      sourceX: 0,
      sourceY: 0,
      sourceWidth: ts1.width,
      sourceHeight: ts1.height,
      delta: -0.004,
    }
  };
  const story4 = {
    ...artBase,
    img: ts2,
    [artBase.INITIAL]: {
      ...artBase[artBase.INITIAL],
      x: 0,
      y: 0,
      alpha: 0,
      sourceX: 0,
      sourceY: 0,
      sourceWidth: ts2.width,
      sourceHeight: ts2.height,
    }
  };
  let shouldSwitch = false;
  return {
    ...stateBase,
    sprites: [
      story3,
      story4,
      gameEndMsg,
    ],
    update: (gameInfo) => {
      if (shouldSwitch) {
        gameInfo.switchState(1);
        shouldSwitch = false;
      } else {
        gameEndMsg.x = getHorizontalCenteredPosition(gameInfo.canvas, gameEndMsg.font, gameEndMsg.text);
        gameEndMsg.y = getVerticalCenteredPosition(gameInfo.canvas, gameEndMsg.font, gameEndMsg.text);
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