function loadEntrance(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      states: {
        INITIAL: {
          sourceWidth: 955,
          sourceHeight: 677,
        }
      },
      onClick: function(x, y, gameState) {
        const item = gameState.selectedInventoryItem;
        if (isWithinRectBounds(x, y, 101, 110, 222, 436)) {
          if (item && item.name === Names.KEY) {
            const beachStuff = [
              Names.CHANDLER_GLASSES,
              Names.MIDORI,
              Names.MEATBALL_SUB,
              Names.PHOEBE_GUITAR,
              Names.RACHEL_HAT,
              Names.JELLYFISH_LOTION,
            ];
            if (beachStuff.every(name => gameState.inventoryItems.findIndex(item => item.name === name) > -1)) {
              gameState.gameOver = true;
              return true;
            }
            gameState.subtitle = 'Something is missing.';
            return true;
          } else {
            gameState.subtitle = 'Got the keys?';
            return true;
          }
        }
      }
    },
    {
      ...base,
      onClick: pickUp,
      states: {
        INITIAL: {
          name: Names.BABY_DOLL_BROWN,
          scale: 0.15,
          x: 5,
          y: 156,
          sourceX: 957,
          sourceY: 0,
          sourceWidth: 352,
          sourceHeight: 430,
          [Displays.STORED]: {
            scale: 0.2,
          },
          [Displays.EXAMINED]: {
            scale: 1,
          }
        },
        FINAL: {
          x: 520,
          y: 78,
          sourceX: 957,
          sourceY: 0,
          sourceWidth: 352,
          sourceHeight: 430,
          scale: 0.1,
          rotation: 30,
        },
      }
    },
  ].map(props => craftSprite(props));
}