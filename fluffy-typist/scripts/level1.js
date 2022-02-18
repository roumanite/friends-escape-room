function getLevel1Info(gameInfo) {
  const categories = [{
    isCriteriaFulfilled: word => word.length === 3,
    count: 3,
  }, {
    isCriteriaFulfilled: word => word.length === 4,
    count: 3,
  }];
  const sprites = [{
    ...rectBase,
    color: Colors.LEMON,
    width: gameInfo.canvas.width,
    height: gameInfo.canvas.height,
  }];
  const ctx = gameInfo.canvas.getContext("2d");
  selectionGenerator.randomize(categories).forEach((result,i) => {
    ctx.font = 'normal bold 30px nokia';
    let width = ctx.measureText(result.word).width;
    sprites.push({
      ...textBase,
      x: Math.floor(Math.random() * (gameInfo.canvas.width/width)) * width,
      y: i,
      vy: 0.3,
      text: result.word,
      font: 'normal bold 30px nokia',
      color: 'rgb(91,85,1)',
      visible: false,
      timer: i * 32/0.3,
    });
  });
  return {
    ...stateBase,
    sprites: sprites,
    update: () => {
      var count = 0;
      sprites.forEach(sprite => {
        if (sprite.visible && sprite.vy !== undefined) {
          sprite.y += sprite.vy;
        }
        if (sprite.timer !== undefined && sprite.timer <= 0) {
          sprite.visible = true;
          sprite.timer = undefined;
        }
        if (sprite.timer !== undefined && sprite.timer > 0) {
          sprite.timer -= 1;
        }
        if (sprite.y > gameInfo.canvas.height) {
          sprite.visible = false;
          count++;
        }
      })
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