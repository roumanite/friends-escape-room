function getIntroInfo(gameInfo, ts1, ts2) {
  const story1 = {
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
  const story2 = {
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
  return {
    ...stateBase,
    sprites: [
    story1,
    story2,
    {
      ...textBase,
      font: 'normal bold 100px nokia',
      baseline: 'top',
      color: Colors.GENERIC_GRAY,
      text: 'Fluffy Typist',
      shadowBlur: 10,
      x: 80,
      y: 80,
    }, {
      ...textBase,
      font: 'normal bold 100px nokia',
      color: Colors.LIGHT_BLUE,
      text: "Fluffy Typist",
      x: 85, y: 85,
    }, {
      ...textBase,
      font: 'normal bold 100px nokia',
      color: Colors.DARK_BLUE,
      text: 'Fluffy Typist',
      x: 90, y: 90,
    }, {
      ...textBase,
      font: 'normal bold 24px nokia',
      color: Colors.LIGHT_BLUE,
      text: 'Help Fluffy write his restaurant menu!',
      shadowBlur: 20,
      shadowColor: Colors.DARK_BLUE,
      width: 10,
      x: 80, y: 230,
    }, {
      ...textBase,
      font: 'normal bold 30px nokia',
      color: Colors.LIGHT_BLUE,
      text: 'Press ENTER to start',
      x: 80, y: 290,
      shadowBlur: 20,
      width: 10,
      shadowColor: Colors.DARK_BLUE,
    }],
    update: function() {
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
    },
    listeners: {
      'keydown': function(e) {
        if (e.key === 'Enter') {
          gameInfo.switchState();
        }
      }
    }
  };
}