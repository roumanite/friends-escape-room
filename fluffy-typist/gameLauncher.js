launch();

function launch() {
  const numOfLevels = 2;
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  selectionGenerator.words = words;

  // Game states related
  const states = new Array(Object.keys(States).length + numOfLevels).fill({});
  let currentState = 0;
  let previousState = -1;
  let sprites = [];

  window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  const assets = [
    [],
    ['./assets/nokiafc22.ttf', './assets/story1.jpg', './assets/story2.jpg'],
    ['./assets/nokiafc22.ttf', './assets/tilesheet.png'],
    ['./assets/nokiafc22.ttf', './assets/tilesheet.png'],
    ['./assets/nokiafc22.ttf', './assets/story3.jpg', './assets/story4.jpg'],
  ];
  
  let totalAssets = [];
  assets.forEach(asset => {
    totalAssets = totalAssets.concat(asset);
  });
  new Set(totalAssets).forEach(asset => {
    if (!asset.includes(".ttf")) {
      let tilesheet = loadTilesheet(asset, function() {
        assets.forEach((levelAssets, i) => {
          const idx = levelAssets.indexOf(asset);
          if (idx >= 0) {
            levelAssets[idx] = tilesheet;
            initGameState(i);
          }
        });
      });
    }
  });
  loadFont('./assets/nokiafc22.ttf', 'nokia', function(font) {
    assets.forEach((levelAssets, i) => {
      document.fonts.add(font);
      const idx = levelAssets.indexOf("./assets/nokiafc22.ttf");
      if (idx >= 0) {
        levelAssets[idx] = font;
        initGameState(i);
      }
    });
  });

  const gameInfo = {
    canvas: canvas,
    switchState: function(level = currentState + 1) {
      cleanUpLevel();
      currentState = level;
      sprites = states[currentState].sprites;
      Object.entries(states[currentState].listeners || {}).forEach(([e, callback]) => {
        window.addEventListener(e, callback);
      });
    },
  }
  states[0] = {
    ...stateBase,
    update: () => {
      if (Object.keys(states[1]).length > 0) {
        gameInfo.switchState(previousState === -1 ? currentState + 1 : previousState);
      }
    }
  };

  update();
  function update() {
    requestAnimationFrame(update);
    states[currentState].update(gameInfo);
    render();
  }

  function cleanUpLevel() {
    Object.entries(states[currentState].listeners || {}).forEach(([e, callback]) => {
      window.removeEventListener(e, callback);
    });
  }

  function initGameState(i) {
    if (Object.keys(states[i]).length === 0 && assets[i].every(asset => typeof(asset) !== 'string')) {
      switch(i) {
        case 1:
          states[i] = getIntroInfo(assets[i][1], assets[i][2]);
          break;
        case 2:
          states[i] = getLevel1Info(assets[i][1]);
          break;
        case 3:
          states[i] = getBonusLevelInfo(assets[i][1], assets[i][2]);
          break;
        case 4:
          states[i] = getGameEndInfo(assets[i][1], assets[i][2]);
          break;
        default:
          break;
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sprites.forEach(sprite => {
      if (sprite.visible) {
        ctx.globalAlpha = sprite.alpha;
        switch(sprite.type) {
          case Types.TEXT:
          case Types.WORD_SPAWN:
            ctx.shadowColor = sprite.shadowColor;
            ctx.shadowBlur = sprite.shadowBlur;
            ctx.font = sprite.font;
            ctx.fillStyle = sprite.color;
            ctx.textBaseline = sprite.baseline;
            ctx.fillText(sprite.text, sprite.x, sprite.y);
            break;
          case Types.TEXT_STROKE:
            ctx.font = sprite.font;
            ctx.strokeStyle = sprite.color;
            ctx.textBaseline = sprite.baseline;
            ctx.lineWidth = sprite.width;
            ctx.strokeText(sprite.text, sprite.x, sprite.y);
            break;
          case Types.IMAGE:
            for (let i = 0; i < sprite.repeatX; i++) {
              ctx.drawImage(
                sprite.img,
                sprite.sourceX, sprite.sourceY,
                sprite.sourceWidth, sprite.sourceHeight,
                sprite.x + i * sprite.sourceWidth * sprite.scale,
                sprite.y,
                sprite.sourceWidth * sprite.scale, sprite.sourceHeight * sprite.scale,
              )
            }
          case Types.RECTANGULAR:
            ctx.fillStyle = sprite.color;
            ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
            break;
          default:
            break;
        }
      }
    });
  }
}