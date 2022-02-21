function getBonusLevelInfo(tilesheet) {
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
  const background = {
    ...rectBase,
    color: Colors.GREEN_CYAN,
  };
  const fluffy = createSprite({
    type: Types.IMAGE,
    img: tilesheet,
    states: {
      INITIAL: {
        sourceWidth: 285,
        sourceHeight: 301,
        sourceX: 570,
        sourceY: 301,
      },
      LEFT_PRESS: {
        sourceWidth: 285,
        sourceHeight: 301,
        sourceX: 855,
      },
      RIGHT_PRESS: {
        sourceWidth: 285,
        sourceHeight: 301,
        sourceX: 570,
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
      LEFT_PRESSED: {
        sourceWidth: 162,
        sourceHeight: 45,
        sourceX: 648,
        sourceY: 602,
      },
      RIGHT_PRESSED: {
        sourceWidth: 162,
        sourceHeight: 45,
        sourceX: 486,
        sourceY: 602,
      }
    },
  });
  const inputStart = createSprite({
    type: Types.IMAGE,
    img: tilesheet,
    states: {
      INITIAL: {
        sourceY: 647,
        sourceWidth: 9,
        sourceHeight: 33,
        x: 0,
      },
    },
  });
  const inputContent = createSprite({
    type: Types.RECTANGULAR,
    color: transparentize(Colors.DARK_ORANGE, 0.7),
    x: 9,
  });
  const underscore = createSprite({
    type: Types.TEXT,
    text: '_',
    font: 'normal bold 30px nokia',
    color: Colors.DARK_BROWN,
  });
  const inputText = createSprite({
    type: Types.TEXT,
    text: '',
    font: 'normal bold 30px nokia',
    color: Colors.DARK_BROWN,
    x: 27,
  });
  const inputEnd = createSprite({
    type: Types.IMAGE,
    img: tilesheet,
    states: {
      INITIAL: {
        sourceX: 10,
        sourceY: 647,
        sourceWidth: 9,
        sourceHeight: 33,
      },
    }
  });
  const wordBackgrounds = [
    [{
      type: Types.IMAGE,
      img: tilesheet,
      visible: false,
      states: {
        INITIAL: {
          sourceX: 1004,
          sourceY: 662,
          sourceWidth: 27,
          sourceHeight: 57,
        },
      },
    }, {
      type: Types.IMAGE,
      img: tilesheet,
      visible: false,
      states: {
        INITIAL: {
          sourceX: 1025,
          sourceY: 662,
          sourceWidth: 36,
          sourceHeight: 57,
        },
      },
    }, {
      type: Types.IMAGE,
      img: tilesheet,
      visible: false,
      states: {
        INITIAL: {
          sourceX: 1055,
          sourceY: 662,
          sourceWidth: 12,
          sourceHeight: 57,
        },
      },
    }],
    [{
      type: Types.IMAGE,
      img: tilesheet,
      visible: false,
      states: {
        INITIAL: {
          sourceX: 947,
          sourceY: 662,
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
          sourceX: 956,
          sourceY: 662,
          sourceWidth: 39,
          sourceHeight: 57,
        },
      },
    }, {
      type: Types.IMAGE,
      img: tilesheet,
      visible: false,
      states: {
        INITIAL: {
          sourceX: 992,
          sourceY: 662,
          sourceWidth: 12,
          sourceHeight: 57,
        },
      },
    }],
  ];
  const messageBackground = createSprite({
    type: Types.RECTANGULAR,
    visible: false,
    color: transparentize(Colors.LIGHT_YELLOW, 0.8),
  });
  const gameMessage1 = createSprite({
    type: Types.TEXT,
    font: "normal bold 55px nokia",
    visible: false,
    color: Colors.DARK_BROWN,
  });
  const gameMessage2 = createSprite({
    type: Types.TEXT,
    font: "normal bold 27px nokia",
    visible: false,
    color: Colors.DARK_BROWN,
  });
  const gameMessage3 = createSprite({
    type: Types.TEXT,
    font: "normal bold 25px nokia",
    visible: false,
    color: Colors.DARK_BROWN,
  });
  const gameMessage4 = createSprite({
    type: Types.TEXT,
    font: "normal bold 25px nokia",
    visible: false,
    color: Colors.DARK_BROWN,
  });
  let sprites = [], showHowToPlay = true, totalPoints = 0, lastPress = 1, speedIndex = 0;

  return {
    ...stateBase,
    get sprites() {
      initSprites();
      return sprites;
    },
    update: function(gameInfo) {
      const speeds = [0.3, 0.5, 1];
      const limit = [5, 10, 15];
      background.width = gameInfo.canvas.width;
      background.height = gameInfo.canvas.height;
      let width = getTextWidth(gameInfo.canvas, inputText);
      if (width >= inputContent.width - 100) {
        inputText.text = inputText.text.slice(0, -1);
        width = getTextWidth(gameInfo.canvas, inputText);
      }
      centerFluffy(gameInfo);
      inputStart[inputStart.state].y = inputEnd[inputEnd.state].y = gameInfo.canvas.height - 42;
      inputContent.y = gameInfo.canvas.height - 51;
      inputContent.width = gameInfo.canvas.width - 9 * 2;
      inputEnd[inputEnd.state].x = gameInfo.canvas.width - 9;
      typewriter[typewriter.state].x = centerSpriteHorizontally(gameInfo.canvas, typewriter);
      typewriter[typewriter.state].y = gameInfo.canvas.height - typewriter.sourceHeight * typewriter.scale;
      underscore.x = inputText.x + width;
      underscore.y = inputContent.y + 12;
      inputText.y = underscore.y;
      messageBackground.visible = false;
      gameMessage1.visible = gameMessage2.visible = gameMessage3.visible = gameMessage4.visible = false;
      messageBackground.width = 0.75 * gameInfo.canvas.width;
      messageBackground.height = 0.75 * gameInfo.canvas.height;
      messageBackground.x = centerSpriteHorizontally(gameInfo.canvas, messageBackground);
      messageBackground.y = centerSpriteVertically(gameInfo.canvas, messageBackground);

      if (showHowToPlay) {
        messageBackground.visible = gameMessage1.visible = gameMessage2.visible =  true;
        gameMessage3.visible = gameMessage4.visible = true;
        gameMessage1.text = "Typing Frenzy";
        gameMessage2.text = `Get minimal ${Math.ceil(totalPoints * 3/4)} points out of ${totalPoints} points available.`;
        gameMessage3.text = "Each word's points are worth its length (e.g. cup => 3pt).";
        gameMessage4.text = 'Press ENTER to continue';
        gameMessage1.x = centerSpriteHorizontally(gameInfo.canvas, gameMessage1);
        gameMessage1.y = centerSpriteVertically(gameInfo.canvas, gameMessage1);
        gameMessage2.x = centerSpriteHorizontally(gameInfo.canvas, gameMessage2);
        gameMessage2.y = gameMessage1.y + 80;
        gameMessage3.x = centerSpriteHorizontally(gameInfo.canvas, gameMessage3);
        gameMessage3.y = gameMessage2.y + 40;
        gameMessage4.x = centerSpriteHorizontally(gameInfo.canvas, gameMessage4);
        gameMessage4.y = gameMessage3.y + 40;
        return;
      }

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
              sprite.y = sprites[i-3].y + 57/2 - getTextHeight(gameInfo.canvas, sprite)/2;
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
            [3, 2, 1].forEach(idx => {
              sprites[i-idx].visible = false;
            });
          }
        }
      });
    },
    listeners: {
      'keydown': e => {
        if ((e.key >= "a" && e.key <= "z") || e.key === " ") {
          inputText.text += e.key;
          fluffy.state = lastPress === 1 ? fluffy.LEFT_PRESS : fluffy.RIGHT_PRESS;
          typewriter.state = lastPress === 1 ? typewriter.LEFT_PRESSED : typewriter.RIGHT_PRESSED;
          lastPress *= -1;
        } else if (e.key === "Backspace") {
          inputText.text = inputText.text.slice(0, -1);
          fluffy.state = lastPress === 1 ? fluffy.LEFT_PRESS : fluffy.RIGHT_PRESS;
          typewriter.state = lastPress === 1 ? typewriter.LEFT_PRESSED : typewriter.RIGHT_PRESSED;
          lastPress *= -1;
        } else if (e.key === "Enter") {
          if (showHowToPlay) {
            showHowToPlay = false;
            return;
          }
        }
      },
      'keyup': e => {
        fluffy.state = fluffy.INITIAL;
        typewriter.state = typewriter.INITIAL;
      }
    },
  };

  function centerFluffy(gameInfo) {
    fluffy[fluffy.state].x = centerSpriteHorizontally(gameInfo.canvas, fluffy);
    fluffy[fluffy.state].y = gameInfo.canvas.height - fluffy.sourceHeight * fluffy.scale;
  }

  function initSprites() {
    showHowToPlay = true, totalPoints = 0, lastPress = 1, speedIndex = 0;
    sprites = [
      background,
      fluffy,
      typewriter,
      inputStart,
      inputContent,
      inputEnd,
      inputText,
      underscore,
    ];
    selectionGenerator.randomize(categories).forEach((result, i) => {
      // Alternate cucumber & grater background
      wordBackgrounds[i % 2].forEach(sprite => {
        const bg = createSprite(sprite);
        bg[bg.state].y = i - 60;
        bg[bg.state].timer = i * 60;
        bg[bg.state].vy = 0;
        sprites.push(bg);
      });
      sprites.push({
        ...textBase,
        type: Types.WORD_SPAWN,
        x: 0,
        y: i - 60,
        vy: 0,
        text: result.word,
        font: 'normal bold 30px nokia',
        color: '#CDF6FF',
        visible: false,
        timer: i * 60,
      });
      totalPoints += result.word.length;
    });
    sprites.push(messageBackground);
    sprites.push(gameMessage1);
    sprites.push(gameMessage2);
    sprites.push(gameMessage3);
    sprites.push(gameMessage4);
  }
}