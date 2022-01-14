function loadKitchen(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      onClick: function(x, y, gameState) {
        if (isWithinRectBounds(x, y, 163, 317, 95, 41)) {
          gameState.currentRoom = Layers.KITCHEN_BLUE_DRAWER_1;
          return true;
        }
        if (isWithinRectBounds(x, y, 271, 318, 87, 42)) {
          gameState.currentRoom = Layers.KITCHEN_BLUE_DRAWER_2;
          return true;
        }
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
  const fire = craftSprite(
    {
      ...base,
      states: {
        INITIAL: {
          name: Names.FIRE,
          x: 559,
          y: 490,
          sourceWidth: 202,
          sourceHeight: 79,
          sourceX: 2355,
          sourceY: 300,
          goingRight: true,
          update: function(x, y, gameState) {
            if (this.x > 565) {
              this.goingRight = false;
            }
            if (this.x < 555) {
              this.goingRight = true;
            }
            this.x = this.goingRight ? this.x + 1 : this.x - 1;
            return true;
          },
        }
      },
    }
  );
  return [
    { // Stove background
      ...base,
      onClick: function(x, y, gameState) {
        if (isWithinRectBounds(x, y, 97, 0, 842, 119)
          && gameState.layers[gameState.currentRoom].sprites.every(sprite => sprite.name !== Names.FIRE)
        ) {
          gameState.layers[gameState.currentRoom].sprites.push(fire);
          return true;
        }
      },
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

function loadBlueDrawer1(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      states: {
        INITIAL: {
          sourceX: 3005,
          sourceWidth: 955,
          sourceHeight: 677,
        }
      }
    }
  ].map(sprite => craftSprite(sprite));
}

function loadBlueDrawer2(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      states: {
        INITIAL: {
          sourceX: 3005,
          sourceWidth: 955,
          sourceHeight: 677,
        }
      }
    },
    {
      ...base,
      states: {
        INITIAL: {
          x: 600,
          y: 85,
          sourceX: 3817,
          sourceY: 1555,
          sourceWidth: 125,
          sourceHeight: 481,
        }
      }
    }
  ].map(sprite => craftSprite(sprite));
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
    {
      ...base,
      states: {
        INITIAL: {
          x: 100,
          y: 400,
          sourceWidth: 565,
          sourceHeight: 220,
          sourceX: 1938,
          sourceY: 615,
          sprites: [{
            ...base,
            states: {
              INITIAL: {
                x: 270,
                y: 59,
                sourceWidth: 269,
                sourceHeight: 133,
                sourceX: 2530,
                sourceY: 749,
              }
            }
          }, {
            ...base,
            states: {
              INITIAL: {
                x: 18,
                y: 18,
                sourceWidth: 202,
                sourceHeight: 191,
                sourceX: 2715,
                sourceY: 1259,
              }
            }
          }, {
            ...base,
            states: {
              INITIAL: {
                x: 100,
                y: 30,
                sourceWidth: 355,
                sourceHeight: 106,
                sourceX: 3541,
                sourceY: 1452,
              }
            }
          }, {
            ...base,
            states: {
              INITIAL: {
                x: 200,
                y: 70,
                sourceWidth: 142,
                sourceHeight: 104,
                sourceX: 2805,
                sourceY: 756,
              }
            }
          }, {
            ...base,
            states: {
              INITIAL: {
                x: 2,
                y: 75,
                sourceWidth: 560,
                sourceHeight: 146,
                sourceX: 3032,
                sourceY: 1880,
              }
            }
          }].map(sprite => craftSprite(sprite)),
        }
      }
    }
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