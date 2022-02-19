function getLevel1Info(gameInfo) {
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
  }];
  const sprites = [{
    ...rectBase,
    color: Colors.LEMON,
    width: gameInfo.canvas.width,
    height: gameInfo.canvas.height,
  }];
  const speeds = [1.5, 2, 3];
  let speedIndex = 0;
  const limit = [5, 10, 15];
  const ctx = gameInfo.canvas.getContext("2d");
  selectionGenerator.randomize(categories).forEach((result,i) => {
    ctx.font = 'normal bold 30px nokia';
    ctx.baseline = 'top';
    let width = ctx.measureText(result.word).width;
    const randomNum = Math.floor(Math.random() * Math.floor(gameInfo.canvas.width/width));
    const x = randomNum * Math.ceil(width);
    sprites.push({
      ...textBase,
      x: x,
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
      let spawnedCount = 0;
      sprites.forEach(sprite => {
        if (sprite.visible && sprite.vy !== undefined) {
          sprite.vy = speeds[speedIndex];
          sprite.y += sprite.vy;
        }
        if (sprite.timer !== undefined && sprite.timer <= 0) {
          sprite.visible = true;
          sprite.timer = undefined;
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
            if (sprite.type === TEXT && sprite.text === gameInfo.input) {
              gameInfo.input = '';
              sprite.visible = false;
            }
          });
        }
      }
    }
  };
}