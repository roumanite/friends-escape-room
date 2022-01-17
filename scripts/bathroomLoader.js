function loadBathroom(tilesheet) {
  const base = { img: tilesheet };
  const guitar = craftSprite(
    {
      ...base,
      onClick: pickUp,
      states: {
        INITIAL: {
          name: Names.PHOEBE_GUITAR,
          description: 'Things might get musical',
          x: 430,
          y: 100,
          sourceWidth: 105,
          sourceHeight: 306,
          sourceX: 236,
          sourceY: 1453,
          [Displays.STORED]: { scale: 0.3 },
        }
      }
    }
  );
  const key = craftSprite({
    ...base,
    onClick: pickUp,
    states: {
      INITIAL: {
        name: Names.KEY,
        sourceX: 710,
        sourceY: 1450,
        sourceWidth: 48,
        sourceHeight: 15,
        x: 538,
        y: 526,
        rotation: 10,
        [Displays.STORED]: {
          sourceX: 11,
          sourceY: 1436,
          sourceWidth: 192,
          sourceHeight: 419,
          scale: 0.2,
          rotation: 1,
        },
        [Displays.EXAMINED]: {
          rotation: 1,
          sourceX: 11,
          sourceY: 1436,
          sourceWidth: 192,
          sourceHeight: 419,
          scale: 1,
        },
      }
    }
  });
  const jellyfishLotion = craftSprite({
    ...base,
    states: {
      INITIAL: {
        name: Names.JELLYFISH_LOTION,
        x: 380,
        y: 100,
        sourceWidth: 288,
        sourceHeight: 497,
        sourceX: 786,
        sourceY: 1449,
        [Displays.STORED]: { scale: 0.15 },
      }
    }
  });
  const tapWater = craftSprite({
    ...base,
    states: {
      INITIAL: {
        x: 738,
        y: 288,
        sourceWidth: 101,
        sourceHeight: 52,
        sourceX: 1112,
        sourceY: 1474,
      }
    }
  });
  const bathtubWater = craftSprite({
    ...base,
    states: {
      INITIAL: {
        x: 70,
        y: 258,
        sourceX: 1221,
        sourceY: 1467,
        sourceWidth: 312,
        sourceHeight: 275,
      }
    }
  });
  const leftWaterFlow = craftSprite({
    ...base,
    states: {
      INITIAL: {
        x: 90,
        y: 338,
        sourceX: 1610,
        sourceY: 1471,
        sourceWidth: 44,
        sourceHeight: 147,
      }
    }
  });
  const rightWaterFlow = craftSprite({
    ...base,
    states: {
      INITIAL: {
        x: 145,
        y: 295,
        sourceX: 1610,
        sourceY: 1471,
        sourceWidth: 44,
        sourceHeight: 147,
      }
    }
  });
  return [
    {
      ...base,
      onClick: function(x, y, gameState) {
        const item = gameState.selectedInventoryItem;
        if (this.state === this.INITIAL
          && isWithinRectBounds(x, y, 508, 511, 101, 29)
          && item && item.name === Names.HANDYMAN_TOOL
        ) {
          gameState.layers[gameState.currentRoom].sprites.push(key);
          this.state = this.FINAL;
          return true;
        }
        if (isWithinRectBounds(x, y, 794, 257, 57, 60)) {
          const water = gameState.layers[gameState.currentRoom].sprites.find(sprite => sprite === tapWater);
          if (water) {
            removeOnce(gameState.layers[gameState.currentRoom].sprites, water);
          } else {
            gameState.layers[gameState.currentRoom].sprites.push(tapWater);
          }
          return true;
        }
        const hasLeftWaterFlow = gameState.layers[gameState.currentRoom].sprites.includes(leftWaterFlow);
        const hasRightWaterFlow = gameState.layers[gameState.currentRoom].sprites.includes(rightWaterFlow);
        if (isWithinRectBounds(x, y, 53, 279, 61, 89)) {
          if (hasLeftWaterFlow) {
            removeOnce(gameState.layers[gameState.currentRoom].sprites, leftWaterFlow);
            if (!hasRightWaterFlow) {
              removeOnce(gameState.layers[gameState.currentRoom].sprites, bathtubWater);
            }
          } else {
            gameState.layers[gameState.currentRoom].sprites.push(leftWaterFlow);
            if (!hasRightWaterFlow) {
              gameState.layers[gameState.currentRoom].sprites.push(bathtubWater);
            }
          }
          return true;
        } else if (isWithinRectBounds(x, y, 115, 241, 53, 82)) {
          if (hasRightWaterFlow) {
            removeOnce(gameState.layers[gameState.currentRoom].sprites, rightWaterFlow);
            if (!hasLeftWaterFlow) {
              removeOnce(gameState.layers[gameState.currentRoom].sprites, bathtubWater);
            }
          } else {
            gameState.layers[gameState.currentRoom].sprites.push(rightWaterFlow);
            if (!hasLeftWaterFlow) {
              gameState.layers[gameState.currentRoom].sprites.push(bathtubWater);
            }
          }
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 0,
          y: 0,
          sourceWidth: 955,
          sourceHeight: 677,
          sourceX: 0,
          sourceY: 0,
        },
        FINAL: {
          x: 0,
          y: 0,
          sourceWidth: 955,
          sourceHeight: 677,
          sourceX: 0,
          sourceY: 753,
        }
      }
    },
    {
      ...base,
      onClick: function(x, y, gameState) {
        const item = gameState.selectedInventoryItem;
        const bdWhitePlacement = item && item.name === Names.BABY_DOLL_WHITE && isWithinRectBounds(x, y, 425, 50, 50, 58);
        const bdBlackPlacement = item && item.name === Names.BABY_DOLL_BLACK && isWithinRectBounds(x, y, 510,30,50,58);
        const bdBrownPlacement = item && item.name === Names.BABY_DOLL_BROWN && isWithinRectBounds(x, y,510,88,50,58);
        if (bdWhitePlacement || bdBlackPlacement || bdBrownPlacement) {
          item.state = item.FINAL;
          
          removeOnce(gameState.inventoryItems, item);
          
          gameState.layers[gameState.currentRoom].sprites.push(item);
          if ([Names.BABY_DOLL_WHITE, Names.BABY_DOLL_BLACK, Names.BABY_DOLL_BROWN].every(baby => gameState.layers[gameState.currentRoom].sprites.findIndex(sprite => sprite.name === baby) > -1)) {
            gameState.layers[gameState.currentRoom].sprites.push(guitar);
          }
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 396,
          y: 0,
          sourceWidth: 197,
          sourceHeight: 238,
          sourceX: 370,
          sourceY: 1436,
        },
      }
    },
    {
      ...base,
      onClick: function(x, y, gameState) {
        if (pickUp.bind(this)(x, y, gameState)) {
          return true;
        }
        const examinedState = this[this.state][Displays.EXAMINED];
        const scale = this[this.state][Displays.EXAMINED].scale;
        if (this.state === this.INITIAL) {
          const keyX = scale * 258;
          const keyY = scale * 308;
          const width = scale * 100;
          const height = scale * 100;
          for (let i = 0; i < 12; i++) {
            if (isWithinRectBounds(x, y, keyX + (i % 4) * scale * 106, keyY + Math.floor(i / 4) * scale * 107, width, height)) {
              if (i === 10) {
                examinedState.sprites.pop();
                return true;
              } else if (i === 11) {
                examinedState.sprites = [];
                return true;
              } else if (examinedState.sprites.length < 10) {
                examinedState.sprites.push(craftSprite({
                  ...base,
                  states: {
                    INITIAL: {
                      name: i,
                      x: 94 + examinedState.sprites.length * 80,
                      y: 170,
                      sourceX: 1286 + (i % 4) * 107,
                      sourceY: 332 + Math.floor(i / 4) * 106,
                      sourceWidth: 50,
                      sourceHeight: 50,
                    }
                  }
                }));
                if (examinedState.sprites.map(sprite => sprite.name).join("") === "2043195118") {
                  this.state = this.FINAL;
                }
                
                return true;
              }
            }
          }
        } else {
          if (isWithinRectBounds(
            x, y,
            scale * jellyfishLotion[jellyfishLotion.state].x, scale * jellyfishLotion[jellyfishLotion.state].y,
            scale * jellyfishLotion[jellyfishLotion.state].sourceWidth, scale * jellyfishLotion[jellyfishLotion.state].sourceHeight,
          )) {
            gameState.inventoryItems.push(jellyfishLotion);
            removeOnce(examinedState.sprites, jellyfishLotion);
            gameState.examinedInventoryItem = jellyfishLotion;
            return true;
          }
        }
      },
      states: {
        INITIAL: {
          name: Names.SAFE_BOX,
          sourceWidth: 104,
          sourceHeight: 106,
          sourceX: 582,
          sourceY: 1439,
          x: 236,
          y: 283,
          [Displays.STORED]: {
            scale: 0.8,
          },
          [Displays.EXAMINED]: {
            sourceWidth: 955,
            sourceHeight: 677,
            sourceX: 1000,
            sourceY: 0,
            scale: 0.7,
            sprites: [],
          },
        },
        FINAL: {
          sourceX: 1000,
          sourceY: 751,
          sourceWidth: 955,
          sourceHeight: 677,
          [Displays.STORED]: {
            sourceWidth: 104,
            sourceHeight: 106,
            sourceX: 582,
            sourceY: 1439,
            x: 236,
            y: 283,
            scale: 0.8,
          },
          [Displays.EXAMINED]: {
            scale: 0.7,
            sprites: [jellyfishLotion],
          },
        }
      }
    },
  ].map(sprite => craftSprite(sprite)).concat(leftWaterFlow, rightWaterFlow, bathtubWater);
}