function loadKitchen(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      onClick: function(x, y, gameState) {
        if (isWithinRectBounds(x, y, 643, 148, 146, 160)) {
          gameState.currentRoom = Layers.FREEZER;
          return true;
        }
        if (isWithinRectBounds(x, y, 630, 378, 157, 291)) {
          gameState.currentRoom = Layers.BOTTOM_FRIDGE;
          return true;
        }
        if (isWithinRectBounds(x, y, 0, 177, 164, 125)) {
          gameState.currentRoom = Layers.STOVE;
          return true;
        }
        if (isWithinRectBounds(x, y, 0, 307, 165, 149)) {
          gameState.currentRoom = Layers.OVEN;
          return true;
        }
      },
      states: {
        INITIAL: {
          sourceWidth: 955,
          sourceHeight: 677,
        },
      }
    },
    {
      img: Layers.STOVE,
      states: {
        INITIAL: {
          x: 4,
          y: 190,
          scale: 0.16,
        }
      }
    }
  ].map(props => craftSprite(props));
}

function loadStove(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      states: {
        INITIAL: {
          sourceX: 982,
          sourceWidth: 955,
          sourceHeight: 677,
        }
      }
    },
  ].map(sprite => craftSprite(sprite));
}

function loadOven(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      states: {
        INITIAL: {
          sourceX: 981,
          sourceY: 679,
          sourceWidth: 955,
          sourceHeight: 677,
        }
      }
    },
    {
      ...base,
      states: {
        INITIAL: {
          x: -8,
          y: 528,
          sourceWidth: 978,
          sourceHeight: 157,
          sourceX: 983,
          sourceY: 1386,
        },
        CLOSED: {
          x: 100,
          y: 115,
          sourceWidth: 749,
          sourceHeight: 427,
          sourceX: 978,
          sourceY: 1575,
        },
        LOCKED: {
          x: 100,
          y: 115,
          sourceWidth: 749,
          sourceHeight: 427,
          sourceX: 1741,
          sourceY: 1579,
        },
      },
    },
  ].map(props => craftSprite(props));
}

function loadFreezer(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base, // Freezer background
      states: {
        INITIAL: {
          sourceX: 0,
          sourceY: 679,
          sourceWidth: 955,
          sourceHeight: 677,
        },
      },
    },
    {
      ...base, // Low fat ice cream
      states: {
        INITIAL: {
          description: "When you're getting screwed over all the time, you gotta switch to low fat.",
          sourceWidth: 379,
          sourceHeight: 363,
          sourceX: 1944,
          sourceY: 0,
          scale: 0.5,
          x: 150,
          y: 145,
        }
      }
    },
  ].map(props => craftSprite(props));
}

function loadBottomFridge(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      states: {
        INITIAL: {
          sourceX: 0,
          sourceY: 1361,
          sourceWidth: 955,
          sourceHeight: 677,
        },
      }
    },
    {
      ...base,
      states: {
        INITIAL: {
          description: 'Taste it.',
          x: 180,
          y: 130,
          sourceWidth: 137,
          sourceHeight: 146,
          sourceX: 2291,
          sourceY: 402,
        }
      }
    },
    {
      ...base, // Mozarella cheese
      states: {
        INITIAL: {
          description: "I'm not great with the advice. Can I interest you with a sarcastic comment? Some cheese?",
          x: 340,
          y: 355,
          sourceWidth: 314,
          sourceHeight: 148,
          sourceX: 1956,
          sourceY: 419,
          scale: 0.8,
          [Displays.STORED]: {
            scale: 0.25,
          },
        },
      },
    },
  ].map(props => craftSprite(props));
}