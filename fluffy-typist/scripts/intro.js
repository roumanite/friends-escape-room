function getIntroInfo(ts1, ts2) {
  const story1 = createSprite({
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
    },
  });
  const story2 = createSprite({
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
    },
  });
  let shouldSwitch = false;
  return {
    ...stateBase,
    sprites: [
      story1,
      story2,
      createSprite({
        type: Types.TEXT,
        font: 'normal bold 100px nokia',
        baseline: 'top',
        color: Colors.GENERIC_GRAY,
        text: 'Fluffy Typist',
        shadowBlur: 10,
        x: 80,
        y: 80,
      }),
      createSprite({
        type: Types.TEXT,
        font: 'normal bold 100px nokia',
        color: Colors.LIGHT_BLUE,
        text: "Fluffy Typist",
        x: 85,
        y: 85,
      }),
      createSprite({
        type: Types.TEXT,
        font: 'normal bold 100px nokia',
        color: Colors.DARK_BLUE,
        text: 'Fluffy Typist',
        x: 90,
        y: 90,
      }),
      createSprite({
        type: Types.TEXT,
        font: 'normal bold 24px nokia',
        color: Colors.LIGHT_BLUE,
        text: 'Help Fluffy write his restaurant menu!',
        shadowBlur: 20,
        shadowColor: Colors.DARK_BLUE,
        width: 10,
        x: 80, y: 230,
      }),
      createSprite({
        type: Types.TEXT,
        font: 'normal bold 30px nokia',
        color: Colors.LIGHT_BLUE,
        text: 'Press ENTER to start',
        x: 80, y: 290,
        shadowBlur: 20,
        width: 10,
        shadowColor: Colors.DARK_BLUE,
      }),
    ],
    update: function(gameInfo) {
      if (shouldSwitch) {
        gameInfo.switchState();
        shouldSwitch = false;
      } else {
        [story1, story2].forEach(story => {
          story[story.state].scale = gameInfo.canvas.width/story.img.width;
          story[story.state].alpha = Math.max(0, Math.min(1, story[story.state].alpha + story[story.state].delta));
          if (story[story.state].alpha <= 0 || story[story.state].alpha >= 1){
            story[story.state].delta = -story[story.state].delta;
          }
        });
        if (story1[story1.state].alpha >= 0.3 && story2[story2.state].delta === 0) {
          story2[story2.state].delta = 0.004;
        }
      }
    },
    listeners: {
      'keydown': function(e) {
        if (e.key === 'Enter') {
          shouldSwitch = true;
        }
      }
    }
  };
}