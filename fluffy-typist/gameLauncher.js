launch();

function launch() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  selectionGenerator.words = words;

  const assets = [
    [],
    ['./assets/nokiafc22.ttf', './assets/story.jpg'],
    ['./assets/nokiafc22.ttf'],
  ];
  
  let totalAssets = [];
  assets.forEach(asset => {
    totalAssets = totalAssets.concat(asset);
  });
  new Set(totalAssets).forEach(asset => {
    if (!asset.includes(".ttf")) {
      let tilesheet = loadTilesheet(asset, function() {
        assets.forEach(levelAssets => {
          const idx = levelAssets.indexOf(asset);
          if (idx >= 0) {
            levelAssets[idx] = tilesheet;
          }
        });
      });
    }
  });
  loadFont('./assets/nokiafc22.ttf', 'nokia', function(font) {
    assets.forEach(levelAssets => {
      document.fonts.add(font);
      const idx = levelAssets.indexOf("./assets/nokiafc22.ttf");
      if (idx >= 0) {
        levelAssets[idx] = font;
      }
    });
  });

  let sprites = [];
  let currentState = 0;
  const gameInfo = {
    input: '',
    incrementLevel: () => {
      Object.entries(gameStates[currentState].listeners || {}).forEach(([e, callback]) => {
        window.removeEventListener(e, callback);
      });
      currentState++;
      sprites = gameStates[currentState].sprites;
      Object.entries(gameStates[currentState].listeners || {}).forEach(([e, callback]) => {
        window.addEventListener(e, callback);
      });
    },
    canvas: canvas,
  }
  const gameStates = new Array(3).fill({});
  gameStates[0] = {
    ...stateBase,
    update: () => {
      if (Object.keys(gameStates[1]).length > 0) {
        gameInfo.incrementLevel();
      }
    }
  };

  update();
  function update() {
    requestAnimationFrame(update);
    assets.forEach((levelAssets, i) => {
      if (levelAssets.every(asset => typeof(asset) !== 'string') && Object.keys(gameStates[i]).length === 0) {
        switch(i) {
          case 1:
            gameStates[i] = getIntroInfo(gameInfo, levelAssets.find(asset => asset.constructor.name === "HTMLImageElement"));
            break;
          case 2:
            gameStates[i] = getLevel1Info(gameInfo);
            break;
          default:
            break;
        }
      }
    });
    gameStates[currentState].update();
    render();
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sprites.forEach(sprite => {
      if (sprite.visible) {
        if (sprite.type === TEXT) {
          ctx.shadowColor= sprite.shadowColor;
          ctx.shadowBlur=sprite.shadowBlur;
          ctx.font = sprite.font;
          ctx.fillStyle = sprite.color;
          ctx.textBaseline = sprite.baseline;
          ctx.fillText(sprite.text, sprite.x, sprite.y);
        } else if (sprite.type === STROKE) {
          ctx.font = sprite.font;
          ctx.strokeStyle = sprite.color;
          ctx.textBaseline = sprite.baseline;
          ctx.lineWidth = sprite.width;
          ctx.strokeText(sprite.text, sprite.x, sprite.y);
        } else if (sprite.type === NON_TEXT) {
          const sp = sprite[sprite.state];
          ctx.drawImage(
            sprite.img,
            sp.sourceX, sp.sourceY,
            sp.sourceWidth, sp.sourceHeight,
            sp.x, sp.y,
            sp.sourceWidth * sp.scale, sp.sourceHeight * sp.scale,
          )
        } else {
          ctx.fillStyle = sprite.color;
          ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
        }
      }
    });
  }
}