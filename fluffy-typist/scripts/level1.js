function getLevel1Info(tilesheet) {
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
  const fluffy = createSprite({
    type: Types.IMAGE,
    img: tilesheet,
    states: {
      INITIAL: {
        sourceWidth: 285,
        sourceHeight: 301,
      },
      BOW: {
        sourceX: 285,
        sourceWidth: 285,
        sourceHeight: 301,
      },
      HAPPY: {
        sourceY: 301,
        sourceWidth: 285,
        sourceHeight: 301,
      },
      SAD: {
        sourceX: 285,
        sourceY: 301,
        sourceWidth: 285,
        sourceHeight: 301,
      }
    },
  });
  const typewriter = createSprite({
    type: Types.IMAGE,
    img: tilesheet,
    states: {
      INITIAL: {
        sourceWidth: 162,
        sourceHeight: 45,
        sourceY: 602,
      },
    },
  });
  const inputStart = createSprite({
    type: Types.IMAGE,
    img: tilesheet,
    states: {
      INITIAL: {
        sourceY: 647,
        sourceWidth: 10,
        sourceHeight: 51,
      },
    },
  });
  const inputContent = createSprite({
    type: Types.RECTANGULAR,
    color: transparentize(Colors.DARK_ORANGE, 0.7),
    x: 10,
  });
  const underscore = createSprite({
    type: Types.TEXT,
    text: '_',
    font: 'normal bold 30px nokia',
    color: Colors.BLACK,
  });
  const inputText = createSprite({
    type: Types.TEXT,
    text: '',
    font: 'normal bold 30px nokia',
    color: Colors.BLACK,
    x: 27,
  });
  const wordBackgrounds = [
    createSprite({
      type: Types.IMAGE,
      img: tilesheet,
      states: {
        INITIAL: {
          sourceX: 947,
          sourceY: 602,
          sourceWidth: 24,
          sourceHeight: 60,
        },
      },
    })
  ];
  let sprites = [], totalWordsToSpawn = 0, speedIndex = 0, shouldRestart = false;
  return {
    ...stateBase,
    get sprites() {
      initSprites();
      return sprites;
    },
    maxMissedCount: 5,
    update: function(gameInfo) {
      const speeds = [0.3, 0.5, 0.7];
      const limit = [5, 10, 15];
      sprites[0].width = gameInfo.canvas.width;
      sprites[0].height = gameInfo.canvas.height;
      fluffy[fluffy.state].x = centerSpriteHorizontally(gameInfo.canvas, fluffy);
      fluffy[fluffy.state].y = gameInfo.canvas.height - fluffy.sourceHeight * fluffy.scale;
      inputStart[inputStart.state].y = gameInfo.canvas.height - inputStart.sourceHeight * inputStart.scale;
      inputContent.y = gameInfo.canvas.height - 51;
      inputContent.width = gameInfo.canvas.width - 10 * 2;
      typewriter[typewriter.state].x = centerSpriteHorizontally(gameInfo.canvas, typewriter);
      typewriter[typewriter.state].y = gameInfo.canvas.height - typewriter.sourceHeight * typewriter.scale;
      
      if (shouldRestart) {
        const stateBeforeReset = fluffy.state;
        gameInfo.switchState(stateBeforeReset === fluffy.SAD ? 1 : 3);
        return;
      }

      if (fluffy.state === fluffy.SAD) {
        return;
      }

      let width = getTextWidth(gameInfo.canvas, inputText);
      if (width >= inputContent.width - 100) {
        inputText.text = inputText.text.slice(0, -1);
        width = getTextWidth(gameInfo.canvas, inputText);
      }
      underscore.x = inputText.x + width;
      underscore.y = inputContent.y + 12;
      inputText.y = underscore.y;
      let spawnedCount = 0;
      let missedCount = 0;
      let wordEndOfLifeCount = 0;
      sprites.forEach(sprite => {
        const core = sprite.state === undefined ? sprite : sprite[sprite.state];
        // Update y
        if (sprite.visible && core.vy !== undefined) {
          core.vy = speeds[speedIndex];
          core.y += core.vy;
        }
        if (core.timer !== undefined) {
          if (core.timer <= 0) {
            sprite.visible = true;
            core.timer = undefined;
            if (sprite.type === Types.WORD_SPAWN) {
              const width = getTextWidth(gameInfo.canvas, sprite);
              const randomNum = Math.floor(Math.random() * Math.floor(gameInfo.canvas.width/width));
              const x = randomNum * Math.ceil(width);
              sprite.x = x;
            }
          } else {
            core.timer -= speeds[speedIndex] * 1;
          }
        }

        if (sprite.type === Types.WORD_SPAWN) {
          if (core.y > gameInfo.canvas.height) {
            sprite.visible = false;
            missedCount++;
          }
          if (core.timer === undefined) {
            spawnedCount++;
            if (!sprite.visible) {
              wordEndOfLifeCount++;
            }
          }
        }
      });
      if (speedIndex < speeds.length-1 && spawnedCount >= limit[speedIndex]) {
        speedIndex++;
      }
      if (missedCount >= this.maxMissedCount) {
        fluffy.state = fluffy.SAD;
      } else if (wordEndOfLifeCount === totalWordsToSpawn) {
        fluffy.state = fluffy.HAPPY;
        shouldRestart = true;
      }
    },
    listeners: {
      'keydown': e => {
        if ((e.key >= "a" && e.key <= "z") || e.key === " ") {
          inputText.text += e.key;
          fluffy.state = fluffy.BOW;
        } else if (e.key === "Backspace") {
          inputText.text = inputText.text.slice(0, -1);
          fluffy.state = fluffy.BOW;
        } else if (e.key === "Enter") {
          if (fluffy.state === fluffy.SAD) {
            shouldRestart = true;
            return;
          }
          sprites.forEach(sprite => {
            if (sprite.type === Types.WORD_SPAWN && sprite.text === inputText.text) {
              inputText.text = '';
              sprite.visible = false;
              sprite.timer = undefined;
            }
          });
        }
      },
      'keyup': e => {
        if (fluffy.state === fluffy.BOW) {
          fluffy.state = fluffy.INITIAL;
        }
      },
    }
  };

  function initSprites() {
    fluffy.state = fluffy.INITIAL;
    inputText.text = '';
    sprites = [{
      ...rectBase,
      color: Colors.LEMON,
    }, fluffy, typewriter, inputStart, inputContent, underscore, inputText];
    totalWordsToSpawn = 0, speedIndex = 0, shouldRestart = false;
    selectionGenerator.randomize(categories).forEach((result, i) => {
      sprites.push({
        ...textBase,
        type: Types.WORD_SPAWN,
        x: 0,
        y: i,
        vy: 0,
        text: result.word,
        font: 'normal bold 30px nokia',
        color: Colors.DARK_YELLOW,
        visible: false,
        timer: i * 38,
      });
      totalWordsToSpawn++;
    });
  }
}