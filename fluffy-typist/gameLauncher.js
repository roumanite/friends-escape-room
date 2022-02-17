launch();

function launch() {
  let assetsLoaded = 0;
  let sprites = [];

  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  new FontFace('nokia', 'url(assets/nokiafc22.ttf)').load().then(function(font) {
    document.fonts.add(font);
    assetsLoaded++;
  });

  const tilesheet = new Image();
  tilesheet.addEventListener("load", intro)
  tilesheet.src = "./assets/story.jpg";

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sprites.forEach(sprite => {
      if (sprite.type === TEXT) {
        ctx.font = sprite.font;
        ctx.fillStyle = sprite.color;
        ctx.textBaseline = sprite.baseline;
        ctx.fillText(sprite.text, sprite.x, sprite.y);
      } else {
        const sp = sprite[sprite.state];
        ctx.drawImage(
          sprite.img,
          sp.sourceX, sp.sourceY,
          sp.sourceWidth, sp.sourceHeight,
          sp.x, sp.y,
          sp.sourceWidth * sp.scale, sp.sourceHeight * sp.scale,
        )
      }
    });
  }

  function intro() {
    const story = {
      ...spriteBase,
      img: tilesheet,
      [spriteBase.INITIAL]: {
        x: 0,
        y: 0,
        sourceX: 0,
        sourceY: 0,
        sourceWidth: tilesheet.width,
        sourceHeight: tilesheet.height,
        scale: canvas.width/tilesheet.width,
      }
    }
    sprites.push(story);
    sprites = sprites.concat(
      [{
        ...textBase,
        font: 'normal bold 100px nokia',
        baseline: 'top',
        color: '#7393BC',
        text: 'Fluffy Typist',
        x: 80,
        y: 80,
      }, {
        ...textBase,
        font: 'normal bold 100px nokia',
        color: '#00C1F3',
        text: "Fluffy Typist",
        x: 85, y: 85,
      }, {
        ...textBase,
        font: 'normal bold 100px nokia',
        color: '#002C67',
        text: 'Fluffy Typist',
        x: 90, y: 90,
      }]
    );
    render();
  }
}