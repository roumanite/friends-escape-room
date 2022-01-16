function loadLivingRoom(tilesheet) {
  const base = { img: tilesheet };
  const meatballClamp = craftSprite(
    { 
      ...base,
      onClick: pickUp,
      states: {
        INITIAL: {
          name: Names.MEATBALL_CLAMP,
          description: 'Could it BE anymore round?',
          sourceX: 975,
          sourceY: 1078,
          sourceWidth: 517,
          sourceHeight: 230,
          x: 735,
          y: 520,
          scale: 0.2,
          [Displays.STORED]: {
            scale: 0.15,
          },
        },
      }
    },
  );

  return [
    { // Living room background
      ...base,
      onClick: function(x, y, gameState) {
        if (isWithinRectBounds(x, y, 168, 0, 215, 383)) {
          gameState.currentRoom = Layers.MONICAS_ROOM;
          return true;
        }
        if (isWithinRectBounds(x, y, 720, 0, 210, 317)) {
          gameState.currentRoom = Layers.GUEST_ROOM;
          return true;
        }
        const item = gameState.selectedInventoryItem;
        if (item && item.name === Names.OTTOMAN) {
          item.state = item.FINAL;
          const tableIdx = gameState.layers[gameState.currentRoom].sprites.findIndex(sprite => sprite.name === Names.TABLE);
          gameState.inventoryItems = gameState.inventoryItems.filter(sprite => sprite !== item);
          gameState.layers[gameState.currentRoom].sprites.splice(tableIdx, 0, item);
          gameState.layers[gameState.currentRoom].sprites.splice(tableIdx+1, 0, meatballClamp);
          gameState.selectedInventoryItem = null;
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 0,
          y: 0,
          sourceWidth: 955,
          sourceHeight: 677,
        },
      },
    },
    { // Table
      ...base,
      states: {
        INITIAL: {
          name: Names.TABLE,
          x: 310,
          y: 452,
          sourceX: 993,
          sourceY: 1262,
          sourceWidth: 451,
          sourceHeight: 231,
        },
      }
    },
    { // Cup
      ...base,
      onClick: function(x, y, gameState) {
        const item = gameState.selectedInventoryItem;
        if (item && item.name === Names.COASTER) {
          item.state = item.FINAL;
          this.state = this.HOLDING;
          const tableIdx = gameState.layers[gameState.currentRoom].sprites.findIndex(sprite => sprite.name === Names.CUP);
          gameState.inventoryItems = gameState.inventoryItems.filter(sprite => sprite !== gameState.selectedInventoryItem);
          gameState.layers[gameState.currentRoom].sprites.splice(tableIdx, 0, gameState.selectedInventoryItem);
          gameState.selectedInventoryItem = null;
          return true;
        }
        if (this.state === this.HOLDING && isWithinRectBounds(x, y, 653, 452, 40, 15)) {
          const egg = craftSprite({
            img: tilesheet,
            states: {
              INITIAL: {
                name: Names.EGG,
                description: "The man's got an egg",
                x: 653,
                y: 452,
                sourceX: 827,
                sourceY: 1637,
                sourceWidth: 255,
                sourceHeight: 339,
                scale: 0.5,
                [Displays.STORED]: {
                  scale: 0.2,
                },
              },
              FINAL: {
                name: Names.CRACKED_EGG,
                x: 20,
                y: 3,
                sourceWidth: 215,
                sourceHeight: 201,
                sourceX: 1320,
                sourceY: 439,
              },
            },
          });
          gameState.inventoryItems.push(egg);
          this.state = this.INITIAL;
          return true;
        }
      },
      states: {
        INITIAL: {
          name: Names.CUP,
          x: 653,
          y: 452,
          sourceX: 862,
          sourceY: 1869,
          sourceWidth: 108,
          sourceHeight: 74,
          scale: 0.5,
        },
        HOLDING: {
          x: 653,
          y: 452,
          sourceX: 991,
          sourceY: 1874,
          sourceWidth: 102,
          sourceHeight: 67,
          scale: 0.5,
        },
      }
    },
    { // Laptop
      ...base,
      onClick: function(x, y, gameState) {
        if (this[this.state].isWithinBounds(x, y)) {
          gameState.currentRoom = Layers.LAPTOP;
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 423,
          y: 412,
          sourceX: 970,
          sourceY: 821,
          sourceWidth: 328,
          sourceHeight: 192,
          scale: 0.7,
        },
      }
    },
    { // Chandler
      ...base,
      onClick: pickUp,
      states: {
        INITIAL: {
          name: Names.CHANDLER_FIGURINE,
          description: "I'd be going like this",
          sourceX: 1307,
          sourceY: 11,
          sourceWidth: 232,
          sourceHeight: 398,
          x: 500,
          y: 340,
          scale: 0.2,
          rotation: 90,
          [Displays.STORED]: {
            scale: 0.17,
          },
        },
        FINAL: {
          sourceX: 1307,
          sourceY: 11,
          sourceWidth: 232,
          sourceHeight: 398,
          x: 530,
          y: 200,
          scale: 0.4,
        }
      }
    },
    { // Baby 1
      ...base,
      onClick: function(x, y, gameState) {
        if (this.state === this.INITIAL && this[this.state].isWithinBounds(x, y)) {
          gameState.layers[gameState.currentRoom].sprites = gameState.layers[gameState.currentRoom].sprites.filter(sprite => sprite !== this);
          
          gameState.inventoryItems.push(this);
          return true;
        }
      },
      states: {
        INITIAL: {
          name: Names.BABY_DOLL_WHITE,
          x: 460,
          y: 285,
          sourceX: 961,
          sourceY: 435,
          sourceWidth: 333,
          sourceHeight: 364,
          scale: 0.1,
          [Displays.STORED]: {
            scale: 0.2,
          },
        },
        FINAL: {
          x: 429,
          y: 48,
          sourceX: 961,
          sourceY: 435,
          sourceWidth: 333,
          sourceHeight: 364,
          scale: 0.1,
          rotation: 35,
        },
      }
    },
    { // Flower vase
      ...base,
      states: {
        INITIAL: {
          x: 425,
          y: 196,
          sourceX: 1121,
          sourceY: 1850,
          sourceWidth: 66,
          sourceHeight: 130,
        },
      }
    },
    {
      ...base,
      onClick: pickUp,
      states: {
        INITIAL: {
          name: Names.MARINARA_SAUCE,
          description: 'Italy called and said it was hungry',
          sourceX: 961,
          sourceY: 4,
          sourceWidth: 333,
          sourceHeight: 429,
          x: 870,
          y: 400,
          scale: 0.16,
          [Displays.STORED]: {
            scale: 0.2,
          },
          [Displays.EXAMINED]: {
            scale: 1,
          },
        }
      }
    },
    { // Post-it note
      ...base,
      onClick: pickUp,
      states: {
        INITIAL: {
          x: 170,
          y: 435,
          sourceX: 1156,
          sourceY: 1498,
          sourceWidth: 341,
          sourceHeight: 314,
          scale: 0.1,
          [Displays.STORED]: {
            scale: 0.2,
          },
        }
      }
    },
    { // Pillow 1
      ...base,
      onClick: function(x, y) {
        if (this[this.state].isWithinBounds(x, y)) {
          this.state = this.state === this.INITIAL ? this.LIFTED : this.INITIAL;
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 90,
          y: 390,
          sourceX: 1306,
          sourceY: 901,
          sourceWidth: 171,
          sourceHeight: 113,
        },
        LIFTED: {
          x: 90,
          y: 330,
          sourceX: 1306,
          sourceY: 901,
          sourceWidth: 171,
          sourceHeight: 113,
        },
      }
    },
    { // Pillow 2
      ...base,
      onClick: function(x, y) {
        if (this[this.state].isWithinBounds(x, y)) {
          this.state = this.state === this.INITIAL ? this.LIFTED : this.INITIAL;
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 830,
          y: 380,
          sourceX: 1211,
          sourceY: 1829,
          sourceWidth: 128,
          sourceHeight: 113,
        },
        LIFTED: {
          x: 830,
          y: 320,
          sourceX: 1211,
          sourceY: 1829,
          sourceWidth: 128,
          sourceHeight: 113,
        },
      }
    }
  ].map(sprite => craftSprite(sprite));
}

function loadLaptop(tilesheet) {
  const base = { img: tilesheet };
  const alphabetX = [18, 73, 127, 182, 236, 290, 344, 396, 450, 505, 559, 612];
  const alphabetY = [1777, 1833, 1888];
  const canvasAlphX = [162, 217, 270, 325, 380, 434, 487, 540, 594, 648, 702, 755];
  const canvasAlphY = [318, 374, 428];

  return [
    {
      ...base,
      states: {
        INITIAL: {
          sourceY: 692,
          sourceWidth: 955,
          sourceHeight: 677,
        },
      }
    },
    {
      ...base,
      onClick: function(x, y, gameState) {
        if (this.state === this.INITIAL) {
          if (isWithinRectBounds(x, y, 270, 428, 50, 50)) {
            this[this.state].sprites.pop();
            return true;
          }
          if (isWithinRectBounds(x, y, 325, 428, 50, 50)) {
            this[this.state].sprites = [];
            return true;
          }
          if (this[this.INITIAL].sprites.length < 11) {
            for (let i = 0; i < 26; i++) {
              const alphX = i % alphabetX.length;
              const alphY = Math.floor(i/alphabetX.length);
              if (isWithinRectBounds(x, y, canvasAlphX[alphX], canvasAlphY[alphY], 50, 50)) {
                this[this.state].sprites.push(craftSprite(
                  {
                    ...base,
                    states: {
                      INITIAL: {
                        name: i,
                        x: (25 + 10) * (this[this.state].sprites.length+1),
                        y: 42,
                        sourceX: alphabetX[alphX],
                        sourceY: alphabetY[alphY],
                        sourceWidth: 50,
                        sourceHeight: 50,
                      }
                    }
                  }
                ));
                if (this[this.state].sprites.map(sprite => sprite.name).join(",") === "1,8,13,6") {
                  this.state = this.FINAL;
                }
                return true;
              }
            }
          }
        }
      },
      states: {
        INITIAL: {
          x: 154,
          y: 200,
          sourceX: 11,
          sourceY: 1661,
          sourceWidth: 657,
          sourceHeight: 284,
          sprites: [],
        },
        FINAL: {
          sourceX: 9,
          sourceY: 1379,
          sourceWidth: 838,
          sourceHeight: 245,
          x: 50,
          y: 200,
        }
      }
    }
  ].map(sprite => craftSprite(sprite));
}