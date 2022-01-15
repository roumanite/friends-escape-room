function loadGuestRoom(tilesheet) {
  const base = { img: tilesheet };
  return [
    { // Guest bedroom background
      ...base,
      onClick: function(x, y, gameState) {
        if (isWithinRectBounds(x, y, 24, 0, 167, 489)) {
          gameState.currentRoom = Layers.LIVING_ROOM;
          return true;
        }
        if (isWithinRectBounds(x, y, 227, 218, 317, 51)) {
          gameState.currentRoom = Layers.GUEST_WHITE_DRAWER_1;
          return true;
        }
        if (isWithinRectBounds(x, y, 233, 273, 307, 50)) {
          gameState.currentRoom = Layers.GUEST_WHITE_DRAWER_2;
          return true;
        }
        if (isWithinRectBounds(x, y, 231, 331, 311, 57)) {
          gameState.currentRoom = Layers.GUEST_WHITE_DRAWER_3;
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
      }
    },
    { // Breadcrumbs
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
          name: Names.BREADCRUMBS,
          x: 780,
          y: 210,
          sourceX: 1229,
          sourceY: 25,
          sourceWidth: 242,
          sourceHeight: 343,
          scale: 0.25,
          [Displays.STORED]: {
            scale: 0.2,
          },
        },
      }
    },
    { // Big Pillow
      ...base,
      onClick: function(x, y) {
        if (this[this.state].isWithinBounds(x, y)) {
          this.state = this.state === this.INITIAL ? this.LIFTED : this.INITIAL;
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 710,
          y: 170,
          sourceX: 1506,
          sourceY: 19,
          sourceWidth: 205,
          sourceHeight: 144,
        },
        LIFTED: {
          x: 710,
          y: 100,
          sourceX: 1506,
          sourceY: 19,
          sourceWidth: 205,
          sourceHeight: 144,
        },
      },
    },
    { // Small pillow 1
      ...base,
      onClick: function(x, y) {
        if (this[this.state].isWithinBounds(x, y)) {
          this.state = this.state === this.INITIAL ? this.LIFTED : this.INITIAL;
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 620,
          y: 210,
          sourceX: 1497,
          sourceY: 196,
          sourceWidth: 159,
          sourceHeight: 118,
        },
        LIFTED: {
          x: 620,
          y: 150,
          sourceX: 1497,
          sourceY: 196,
          sourceWidth: 159,
          sourceHeight: 118,
        },
      }
    },
    { // Small pillow 2
      ...base,
      onClick: function(x, y) {
        if (this[this.state].isWithinBounds(x, y)) {
          this.state = this.state === this.INITIAL ? this.LIFTED : this.INITIAL;
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 820,
          y: 200,
          sourceX: 1497,
          sourceY: 196,
          sourceWidth: 159,
          sourceHeight: 118,
        },
        LIFTED: {
          x: 820,
          y: 140,
          sourceX: 1497,
          sourceY: 196,
          sourceWidth: 159,
          sourceHeight: 118,
        },
      }
    },
    { // Shining book
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
          name: Names.THE_SHINING,
          description: 'All blank and no blank makes blank a blank blank.',
          x: 670,
          y: 350,
          sourceX: 1724,
          sourceY: 419,
          sourceWidth: 127,
          sourceHeight: 95,
          [Displays.STORED]: {
            sourceX: 1719,
            sourceY: 14,
            sourceWidth: 271,
            sourceHeight: 390,
            scale: 0.2,
          },
          [Displays.EXAMINED]: {
            sourceX: 1719,
            sourceY: 14,
            sourceWidth: 271,
            sourceHeight: 390,
            scale: 1,
          },
        },
        FINAL: {
          x: 550,
          y: 340,
          sourceX: 1719,
          sourceY: 14,
          sourceWidth: 271,
          sourceHeight: 390,
          scale: 0.7,
        }
      },
    },
    { // Blanket
      ...base,
      onClick: function(x, y) {
        if (this.state === this.INITIAL && isWithinRectBounds(x, y, 598, 326, 253, 199)) {
          this.state = this.LIFTED;
          return true;
        }
        if (this.state === this.LIFTED && isWithinRectBounds(x, y, 729, 407, 130, 121)) {
          this.state = this.INITIAL;
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 590,
          y: 350,
          sourceX: 967,
          sourceY: 412,
          sourceWidth: 371,
          sourceHeight: 349,
        },
        LIFTED: {
          x: 613,
          y: 345,
          sourceX: 1358,
          sourceY: 379,
          sourceWidth: 344,
          sourceHeight: 352,
        },
      }
    },
    { // Teddy bear
      ...base,
      onClick: function(x, y) {
        if (this[this.state].isWithinBounds(x, y)) {
          this.state = this.state === this.INITIAL ? this.LIFTED : this.INITIAL;
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 800,
          y: 220,
          sourceX: 1879,
          sourceY: 424,
          sourceWidth: 70,
          sourceHeight: 114,
        },
        LIFTED: {
          x: 800,
          y: 160,
          sourceX: 1879,
          sourceY: 424,
          sourceWidth: 70,
          sourceHeight: 114,
        },
      },
    },
    { // Ottoman
      ...base,
      onClick: pickUp,
      states: {
        INITIAL: {
          name: Names.OTTOMAN,
          description: "I can't believe you tried to move the green ottoman.",
          x: 20,
          y: 500,
          sourceX: 976,
          sourceY: 13,
          sourceWidth: 219,
          sourceHeight: 184,
          scale: 0.7,
          [Displays.STORED]: {
            scale: 0.3,
          },
        },
        FINAL: {
          sourceX: 969,
          sourceY: 205,
          sourceWidth: 222,
          sourceHeight: 186,
          x: 710,
          y: 500,
          scale: 0.7,
        },
      }
    }
  ].map(sprite => craftSprite(sprite));
}

function loadGuestWhiteDrawer1(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      states: {
        INITIAL: {
          x: 0,
          y: 0,
          sourceWidth: 955,
          sourceHeight: 677,
          sourceX: 0,
          sourceY: 688,
        }
      }
    },
    {
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
          name: 'Chopped onions',
          x: 180,
          y: 150,
          sourceWidth: 443,
          sourceHeight: 315,
          sourceX: 963,
          sourceY: 764,
          scale: 0.7,
          [Displays.STORED]: {
            scale: 0.15,
          },
        },
      },
    },
  ].map(sprite => craftSprite(sprite));
}

function loadGuestWhiteDrawer2(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      states: {
        INITIAL: {
          x: 0,
          y: 0,
          sourceWidth: 955,
          sourceHeight: 677,
          sourceX: 0,
          sourceY: 688,
        }
      }
    },
    {
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
          name: Names.COOKING_OIL,
          scale: 0.9,
          x: 170,
          y: 192,
          sourceWidth: 338,
          sourceHeight: 350,
          sourceX: 1426,
          sourceY: 929,
          [Displays.STORED]: {
            scale: 0.19,
            sourceWidth: 338,
            sourceHeight: 420,
            sourceX: 1426,
            sourceY: 929,
          },
          [Displays.EXAMINED]: {
            scale: 1,
            sourceWidth: 338,
            sourceHeight: 420,
            sourceX: 1426,
            sourceY: 929,
          },
        },
        FINAL: {
          x: 508,
          y: 365,
          sourceWidth: 314,
          sourceHeight: 118,
          sourceX: 1020,
          sourceY: 1159,
        }
      }
    },
  ].map(sprite => craftSprite(sprite));
}

function loadGuestWhiteDrawer3(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      states: {
        INITIAL: {
          x: 0,
          y: 0,
          sourceWidth: 955,
          sourceHeight: 677,
          sourceX: 0,
          sourceY: 688,
        },
      }
    },
    {
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
          name: Names.BABY_DOLL_BLACK,
          scale: 0.5,
          x: 500,
          y: 50,
          sourceWidth: 230,
          sourceHeight: 441,
          sourceX: 1736,
          sourceY: 545,
          [Displays.STORED]: {
            scale: 0.19,
          },
        },
        FINAL: {
          x: 520,
          y: 30,
          sourceWidth: 230,
          sourceHeight: 441,
          sourceX: 1736,
          sourceY: 545,
          scale: 0.1,
          rotation: 335,
        },
      },
    }
  ].map(sprite => craftSprite(sprite));
}
