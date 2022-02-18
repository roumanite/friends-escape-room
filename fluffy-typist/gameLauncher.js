launch();

function launch() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  selectionGenerator.words = words;

  let assetsLoaded = 0;
  const totalAssetCount = 2;
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
  const gameStates = [{
    ...stateBase,
    update: () => {
      if (assetsLoaded === totalAssetCount) {
        gameInfo.incrementLevel();
      }
    }
  }];

  gameStates[2] = getLevel1Info(gameInfo);

  new FontFace('nokia', 'url(assets/nokiafc22.ttf)').load().then(function(font) {
    document.fonts.add(font);
    assetsLoaded++;
  });

  const tilesheet = new Image();
  tilesheet.addEventListener("load", function() {
    gameStates[1] = getIntroInfo(gameInfo, tilesheet);
    assetsLoaded++;
  })
  tilesheet.src = "./assets/story.jpg";

  update();
  function update() {
    requestAnimationFrame(update);
    gameStates[currentState].update();
    render();
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sprites.forEach(sprite => {
      if (sprite.visible) {
        if (sprite.type === TEXT) {
          ctx.font = sprite.font;
          ctx.fillStyle = sprite.color;
          ctx.textBaseline = sprite.baseline;
          ctx.fillText(sprite.text, sprite.x, sprite.y);
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