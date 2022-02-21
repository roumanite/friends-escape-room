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
    [{
      type: Types.IMAGE,
      img: tilesheet,
      visible: false,
      states: {
        INITIAL: {
          sourceX: 947,
          sourceY: 602,
          sourceWidth: 24,
          sourceHeight: 60,
        },
      },
    }, {
      type: Types.IMAGE,
      img: tilesheet,
      visible: false,
      states: {
        INITIAL: {
          sourceX: 971,
          sourceY: 602,
          sourceWidth: 33,
          sourceHeight: 60,
        },
      },
    }, {
      type: Types.IMAGE,
      img: tilesheet,
      visible: false,
      states: {
        INITIAL: {
          sourceX: 1004,
          sourceY: 602,
          sourceWidth: 24,
          sourceHeight: 60,
        },
      },
    }],
    [{
      type: Types.IMAGE,
      img: tilesheet,
      visible: false,
      states: {
        INITIAL: {
          sourceX: 1028,
          sourceY: 602,
          sourceWidth: 12,
          sourceHeight: 57,
        },
      },
    }, {
      type: Types.IMAGE,
      img: tilesheet,
      visible: false,
      states: {
        INITIAL: {
          sourceX: 1031,
          sourceY: 602,
          sourceWidth: 30,
          sourceHeight: 57,
        },
      },
    }, {
      type: Types.IMAGE,
      img: tilesheet,
      visible: false,
      states: {
        INITIAL: {
          sourceX: 1052,
          sourceY: 602,
          sourceWidth: 12,
          sourceHeight: 57,
        },
      },
    }],
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
      sprites.forEach((sprite, i) => {
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
              const textWidth = getTextWidth(gameInfo.canvas, sprite)
              sprites[i-2][sprites[i-2].state].repeatX = Math.ceil(textWidth/sprites[i-2].sourceWidth * sprites[i-2].scale);
              const totalWidth = sprites[i-3].sourceWidth * sprites[i-3].scale +
                sprites[i-2].sourceWidth * sprites[i-2].scale * sprites[i-2].repeatX +
                sprites[i-1].sourceWidth * sprites[i-1].scale;
              const randomNum = Math.floor(Math.random() * Math.floor(gameInfo.canvas.width/totalWidth));
              const x = randomNum * Math.ceil(totalWidth);
              sprites[i-3][sprites[i-3].state].x = x;
              sprite.x =
                sprites[i-3].x + sprites[i-3].sourceWidth * sprites[i-3].scale +
                sprites[i-2].sourceWidth * sprites[i-2].scale * sprites[i-2].repeatX / 2 -
                textWidth / 2;
              sprites[i-2][sprites[i-2].state].x = sprites[i-3].x + sprites[i-3].sourceWidth * sprites[i-3].scale;
              sprites[i-1][sprites[i-1].state].x = sprites[i-2].x + sprites[i-2].sourceWidth * sprites[i-2].scale * sprites[i-2].repeatX;
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
      // Alternate bread & butter background
      wordBackgrounds[i % 2].forEach(sprite => {
        const bg = createSprite(sprite);
        bg[bg.state].y = i - bg.sourceHeight * bg.scale/3;
        bg[bg.state].timer = i * 60;
        bg[bg.state].vy = 0;
        sprites.push(bg);
      });
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
        timer: i * 60,
      });
      totalWordsToSpawn++;
    });
  }
}