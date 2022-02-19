function getLevel1Info(gameInfo, tilesheet) {
  const categories = [{
    isCriteriaFulfilled: word => word.length === 3,
    count: 3,
  }, {
    isCriteriaFulfilled: word => word.length === 4,
    count: 10,
  },{
    isCriteriaFulfilled: word => word.length === 5,
    count: 10,
  }, {
    isCriteriaFulfilled: word => word.length === 6,
    count: 10,
  }, {
    isCriteriaFulfilled: word => word.length === 7,
    count: 10,
  }, {
    isCriteriaFulfilled: word => word.length === 8,
    count: 1,
  }];
  const fluffy = {
    ...artBase,
    img: tilesheet,
    [artBase.INITIAL]: {
      ...artBase[artBase.INITIAL],
      sourceWidth: 285,
      sourceHeight: 301,
    },
  };
  const sprites = [{
    ...rectBase,
    color: Colors.LEMON,
  }, fluffy];
  const speeds = [2, 3, 5];
  let speedIndex = 0;
  const limit = [5, 10, 15];
  selectionGenerator.randomize(categories).forEach((result,i) => {
    sprites.push({
      ...textBase,
      x: 0,
      y: i,
      vy: speeds[0],
      text: result.word,
      font: 'normal bold 30px nokia',
      color: Colors.DARK_YELLOW,
      visible: false,
      timer: i * 38,
    });
  });
  return {
    ...stateBase,
    sprites: sprites,
    update: () => {
      sprites[0].width = gameInfo.canvas.width;
      sprites[0].height = gameInfo.canvas.height;
      fluffy[fluffy.state].x = gameInfo.canvas.width / 2 - fluffy[fluffy.state].sourceWidth * fluffy[fluffy.state].scale / 2;
      fluffy[fluffy.state].y = gameInfo.canvas.height - fluffy[fluffy.state].sourceHeight * fluffy[fluffy.state].scale;
      let spawnedCount = 0;
      sprites.forEach(sprite => {
        if (sprite.visible && sprite.vy !== undefined) {
          sprite.vy = speeds[speedIndex];
          sprite.y += sprite.vy;
        }
        if (sprite.timer !== undefined && sprite.timer <= 0) {
          const ctx = gameInfo.canvas.getContext("2d");
          sprite.visible = true;
          sprite.timer = undefined;
          ctx.font = sprite.font;
          ctx.baseline = 'top';
          let width = ctx.measureText(sprite.text).width;
          const randomNum = Math.floor(Math.random() * Math.floor(gameInfo.canvas.width/width));
          const x = randomNum * Math.ceil(width);
          sprite.x = x;
        }
        if (sprite.timer === undefined && sprite.type === Types.TEXT) {
          spawnedCount++;
        }
        if (sprite.timer !== undefined && sprite.timer > 0) {
          sprite.timer -= speeds[speedIndex] * 1;
        }
        if (sprite.y > gameInfo.canvas.height) {
          sprite.visible = false;
          spawnedCount++;
        }
      });
      if (speedIndex < speeds.length-1 && spawnedCount >= limit[speedIndex]) {
        speedIndex++;
      }
    },
    listeners: {
      'keydown': (e) => {
        if (e.key >= "a" && e.key <= "z") {
          gameInfo.input += e.key;
        }
        if (e.key === "Enter") {
          sprites.forEach(sprite => {
            if (sprite.type === Types.TEXT && sprite.text === gameInfo.input) {
              gameInfo.input = '';
              sprite.visible = false;
            }
          });
        }
      }
    }
  };
}