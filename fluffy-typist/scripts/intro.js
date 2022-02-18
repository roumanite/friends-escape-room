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
      color: '#7393BC',
      text: 'Fluffy Typist',
      x: 80,
      y: 80,
    }, {
      ...textBase,
      font: 'normal bold 100px nokia',
      color: '#00C1F3',
      text: "Fluffy Typist",
      x: 85, y: 85,
    }, {
      ...textBase,
      font: 'normal bold 100px nokia',
      color: '#002C67',
      text: 'Fluffy Typist',
      x: 90, y: 90,
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