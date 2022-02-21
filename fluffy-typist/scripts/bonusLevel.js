function getBonusLevelInfo(tilesheet) {
  const fluffy = createSprite({
    type: Types.IMAGE,
    img: tilesheet,
    states: {
      INITIAL: {
        sourceWidth: 285,
        sourceHeight: 301,
      },
      LEFT_PRESS: {
        sourceWidth: 285,
        sourceHeight: 301,
        sourceX: 855,
      },
      RIGHT_PRESS: {
        sourceWidth: 285,
        sourceHeight: 301,
        sourceX: 569,
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

  function initSprites() {
    
  }
}