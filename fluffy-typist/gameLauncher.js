launch();

function launch() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  selectionGenerator.words = words;

  window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  const assets = [
    [],
    ['./assets/nokiafc22.ttf', './assets/story1.jpg', './assets/story2.jpg'],
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
    states: new Array(4).fill({}),
    currentState: 0,
    previousState: -1,
    canvas: canvas,
    sprites: [],
    switchState: function(level = this.currentState + 1) {
      cleanUpLevel();
      this.currentState = level;
      this.sprites = gameInfo.states[this.currentState].sprites;
      Object.entries(gameInfo.states[this.currentState].listeners || {}).forEach(([e, callback]) => {
        window.addEventListener(e, callback);
      });
    },
  }
  gameInfo.states[0] = {
    ...stateBase,
    update: () => {
      if (Object.keys(gameInfo.states[1]).length > 0) {
        gameInfo.switchState(gameInfo.previousState === -1 ? gameInfo.currentState + 1 : gameInfo.previousState);
      }
    }
  };

  update();
  function update() {
    requestAnimationFrame(update);
    gameInfo.states[gameInfo.currentState].update(gameInfo);
    render();
  }

  function cleanUpLevel() {
    Object.entries(gameInfo.states[gameInfo.currentState].listeners || {}).forEach(([e, callback]) => {
      window.removeEventListener(e, callback);
    });
  }

  function initGameState(i) {
    if (Object.keys(gameInfo.states[i]).length === 0 && assets[i].every(asset => typeof(asset) !== 'string')) {
      switch(i) {
        case 1:
          gameInfo.states[i] = getIntroInfo(assets[i][1], assets[i][2]);
          break;
        case 2:
          gameInfo.states[i] = getLevel1Info(assets[i][1]);
          break;
        case 3:
          gameInfo.states[i] = getGameEndInfo(assets[i][1], assets[i][2]);
        default:
          break;
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameInfo.sprites.forEach(sprite => {
      if (sprite.visible) {
        const core = sprite.state === undefined ? sprite : sprite[sprite.state];
        switch(sprite.type) {
          case Types.TEXT:
          case Types.WORD_SPAWN:
            ctx.globalAlpha = core.alpha;
            ctx.shadowColor = core.shadowColor;
            ctx.shadowBlur = core.shadowBlur;
            ctx.font = core.font;
            ctx.fillStyle = core.color;
            ctx.textBaseline = core.baseline;
            ctx.fillText(core.text, core.x, core.y);
            break;
          case Types.TEXT_STROKE:
            ctx.globalAlpha = core.alpha;
            ctx.font = core.font;
            ctx.strokeStyle = core.color;
            ctx.textBaseline = core.baseline;
            ctx.lineWidth = sprite.width;
            ctx.strokeText(core.text, core.x, core.y);
            break;
          case Types.IMAGE:
            ctx.globalAlpha = core.alpha;
            ctx.drawImage(
              sprite.img,
              core.sourceX, core.sourceY,
              core.sourceWidth, core.sourceHeight,
              core.x, core.y,
              core.sourceWidth * core.scale, core.sourceHeight * core.scale,
            )
          case Types.RECTANGULAR:
            ctx.fillStyle = sprite.color;
            ctx.fillRect(core.x, core.y, core.width, core.height);
            break;
          default:
            break;
        }
      }
    });
  }
}