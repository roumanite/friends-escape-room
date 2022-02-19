function getIntroInfo(gameInfo, tilesheet) {
  return {
    ...stateBase,
    sprites: [{
      ...artBase,
      img: tilesheet,
      [artBase.INITIAL]: {
        x: 0,
        y: 0,
        sourceX: 0,
        sourceY: 0,
        sourceWidth: tilesheet.width,
        sourceHeight: tilesheet.height,
        scale: gameInfo.canvas.width/tilesheet.width,
      }
    }, {
      ...textBase,
      font: 'normal bold 100px nokia',
      baseline: 'top',
      color: Colors.DARK_BLUE,
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
    listeners: {
      'keydown': function(e) {
        if (e.key === 'Enter') {
          gameInfo.incrementLevel();
        }
      }
    }
  };
}