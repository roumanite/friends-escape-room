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
          sourceX: 1187,
          sourceY: 7,
          [Displays.STORED]: {
            scale: 0.3,
          }
        }
      }
    }
  );
  const key = craftSprite(
    {
      ...base,
      onClick: function(x, y, gameState) {
        if (this[this.state].isWithinBounds(x, y)) {
          gameState.inventoryItems.push(this);
          removeOnce(gameState.layers[gameState.currentRoom].sprites, this);
          return true;
        }
      },
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
          }
        }
      }
    },
  );
  return [
    {
      ...base,
      onClick: function(x, y, gameState) {
        if (this.state === this.INITIAL && this[this.state].isWithinBounds(x, y)) {
          gameState.layers[gameState.currentRoom].sprites.push(key);
          this.state = this.FINAL;
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
          
          gameState.inventoryItems = gameState.inventoryItems.filter(sprite => sprite !== item);
          
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
          },
        },
      }
    },
  ].map(sprite => craftSprite(sprite));
}