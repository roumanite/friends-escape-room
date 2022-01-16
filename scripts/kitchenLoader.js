function loadKitchen(tilesheet) {
  const base = { img: tilesheet };
  return [
    { // Kitchen background
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
    { // Zoomed out stove
      img: Layers.STOVE,
      states: {
        INITIAL: {
          x: 4,
          y: 190,
          scale: 0.16,
        }
      }
    },
    { // Frying pan
      ...base,
      onClick: function(x, y, gameState) {
        if (pickUp.bind(this)(x, y, gameState)) {
          return true;
        }
        const item = gameState.selectedInventoryItem;
        if (item && item.name === Names.COOKING_OIL && this.state === this.FINAL && this[this.state].isWithinBounds(x, y)) {
          item.state = item.FINAL;
          removeOnce(gameState.inventoryItems, item);
          gameState.layers[gameState.currentRoom].sprites.push(item);
          return true;
        }
        
        if (item && item.name === Names.RAW_MEATBALL && this[this.state].isWithinBounds(x, y)) {
          removeOnce(gameState.inventoryItems, item);
          gameState.layers[gameState.currentRoom].sprites.push(item);
          return true;
        }
      },
      states: {
        INITIAL: {
          name: Names.FRYING_PAN,
          x: 43,
          y: 20,
          sourceWidth: 106,
          sourceHeight: 131,
          sourceX: 2456,
          sourceY: 407,
          [Displays.STORED]: {
            scale: 0.15,
            sourceWidth: 560,
            sourceHeight: 271,
            sourceX: 2356,
            sourceY: 0,
          },
          [Displays.EXAMINED]: {
            scale: 1,
            sourceWidth: 560,
            sourceHeight: 271,
            sourceX: 2356,
            sourceY: 0,
          },
        },
        FINAL: {
          x: 380,
          y: 275,
          sourceWidth: 560,
          sourceHeight: 271,
          sourceX: 2356,
          sourceY: 0,
        }
      },
    },
    { // Handyman tool
      ...base,
      onClick: pickUp,
      states: {
        INITIAL: {
          name: Names.HANDYMAN_TOOL,
          x: 309,
          y: 45,
          sourceWidth: 411,
          sourceHeight: 107,
          sourceX: 2549,
          sourceY: 630,
          scale: 0.2,
          [Displays.STORED]: { scale: 0.2 },
          [Displays.EXAMINED]: { scale: 1 },
        }
      },
    },
    { // Spices
      ...base,
      onClick: pickUp,
      states: {
        INITIAL: {
          name: Names.SPICES,
          x: 399,
          y: 205,
          sourceWidth: 241,
          sourceHeight: 316,
          sourceX: 2592,
          sourceY: 294,
          scale: 0.1,
          [Displays.STORED]: { scale: 0.27 },
          [Displays.EXAMINED]: { scale: 1 },
        },
        FINAL: {
          x: 100,
          y: 30,
          sourceWidth: 355,
          sourceHeight: 106,
          sourceX: 3541,
          sourceY: 1452,
        }
      },
    }
  ].map(props => craftSprite(props));
}

function loadStove(tilesheet) {
  const base = { img: tilesheet };
  const fire = craftSprite(
    {
      ...base,
      update: function(gameState) {
        if (this[this.state].x > 565) {
          this[this.state].goingRight = false;
        }
        if (this[this.state].x < 555) {
          this[this.state].goingRight = true;
        }
        this[this.state].x = this[this.state].goingRight ? this[this.state].x + 1 : this[this.state].x - 1;
        return true;
      },
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
        }
      },
    }
  );
  return [
    { // Stove background
      ...base,
      onClick: function(x, y, gameState) {
        const item = gameState.selectedInventoryItem;
        if (item && item.name === Names.FRYING_PAN) {
          item.state = item.FINAL;
          removeOnce(gameState.inventoryItems, item);
          const fireIdx = gameState.layers[gameState.currentRoom].sprites.indexOf(fire);
          if (fireIdx > -1) {
            gameState.layers[gameState.currentRoom].sprites.splice(fireIdx, 0, item);
          } else {
            gameState.layers[gameState.currentRoom].sprites.push(item);
          }
          
          return true;
        }

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
  const door = craftSprite({
    ...base,
    onClick: function(x, y, gameState) {
      if (this[this.state].isWithinBounds(x, y) && this.state !== this.LOCKED) {
        this.state = this.state === this.INITIAL ? this.CLOSED : this.INITIAL;
        return true;
      }
    },
    update: function(gameState) {
      if (this.state === this.LOCKED) {
        if (this[this.state].timer === 0) {
          this[this.state].timer = this[this.state].defaultTimer;
          this.state = this.INITIAL;
        } else {
          this[this.state].timer--;
        }
        return true;
      }
      return false;
    },
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
        defaultTimer: 80,
        timer: 80,
      },
    },
  });
  return [
    {
      ...base,
      onClick: function(x, y, gameState) {
        if (isWithinRectBounds(x, y, this[this.state].x, this[this.state].y, 956, 119)) {
          if (door.state === door.CLOSED) {
            door.state = door.LOCKED;
            return true;
          } else if (door.state !== door.LOCKED) {
            gameState.subtitle = 'Close the door first';
            return true;
          }
        }
      },
      states: {
        INITIAL: {
          sourceX: 981,
          sourceY: 679,
          sourceWidth: 955,
          sourceHeight: 677,
        }
      }
    },
  ].map(props => craftSprite(props)).concat(door);
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
      onClick: pickUp,
      states: {
        INITIAL: {
          name: Names.MIDORI,
          description: "Tell me about it",
          x: 600,
          y: 85,
          sourceX: 3817,
          sourceY: 1555,
          sourceWidth: 125,
          sourceHeight: 481,
          [Displays.STORED]: {
            scale: 0.15,
          },
        }
      }
    }
  ].map(sprite => craftSprite(sprite));
}

function loadFreezer(tilesheet) {
  const base = { img: tilesheet };
  const mixture = [
    Names.EGG,
    Names.CHOPPED_ONIONS,
    Names.BREADCRUMBS,
    Names.SPICES,
  ];
  const frontPlate = craftSprite({
    ...base,
    states: {
      INITIAL: {
        x: 0,
        y: 79,
        sourceWidth: 562,
        sourceHeight: 105,
        sourceX: 3030,
        sourceY: 1889,
        [Displays.STORED]: {
          sourceHeight: 138,
        },
        [Displays.EXAMINED]: {
          sourceHeight: 138,
        },
      },
    }
  });
  const mincedBeef = craftSprite({
    ...base,
    onClick: function(x, y, gameState) {
      if (this.state === this.INITIAL) {
        if (pickUp.bind(this)(x, y, gameState)) {
          return true;
        }

        const sprites = Array(mixture.length).fill(null).concat(frontPlate);
        let shouldRender = false;
        mixture.forEach((ingredientName, i) => {
          const ingredient = combo(gameState, this, ingredientName);
          if (ingredient) {
            shouldRender = true;
            ingredient.state = ingredient.FINAL;
            removeOnce(gameState.inventoryItems, ingredient);
            if (this[this.state].sprites.length > 0) {
              this[this.state].description += ' ';
            }
            this[this.state].description += `+ ${ingredient.name}`;
            sprites[i] = ingredient;
            gameState.examinedInventoryItem = this;
          } else {
            const sprite = this[this.state].sprites.find(sprite => sprite.name === ingredientName);
            if (sprite) {
              sprites[i] = sprite;
            }
          }
        });
        if (shouldRender) {
          this[this.state].sprites = sprites.filter(sprite => sprite);
          return true;
        }
        if (this[this.state].sprites.length === mixture.length + 1) {
          const clamp = combo(gameState, this, Names.MEATBALL_CLAMP);
          if (clamp) {
            this.state = this.RAW;
          }
        }
      }

      if (this.state === this.FRIED) {
        if (pickUp.bind(this)(x, y, gameState, this.state)) {
          return true;
        }
      }
    },
    update: function(gameState) {
      if (this.state === this.RAW || this.state === this.HALF_FRIED) {
        if (this[this.state].timer === 0) {
          this[this.state].timer = this[this.state].defaultTimer;
          if (this.state === this.RAW) {
            this.state = this.HALF_FRIED;
          } else {
            this.state = this.FRIED;
            gameState.layers[Layers.STOVE].sprites.filter(sprite => sprite.name !== Names.FIRE);
          }
        } else {
          this[this.state].timer--;
        }
        return true;
      }
      return false;
    },
    states: {
      INITIAL: {
        name: Names.MINCED_BEEF,
        description: '',
        x: 100,
        y: 430,
        sourceWidth: 565,
        sourceHeight: 175,
        sourceX: 1938,
        sourceY: 615,
        sprites: [frontPlate],
        [Displays.STORED]: {
          scale: 0.15,
          sourceHeight: 220,
        },
        [Displays.EXAMINED]: {
          sourceHeight: 220,
        },
      },
      RAW: {
        name: Names.RAW_MEATBALL,
        description: 'Mixture shaped using meatball clamp',
        x: 400,
        y: 295,
        sourceX: 1951,
        sourceY: 1241,
        sourceWidth: 214,
        sourceHeight: 127,
        defaultTimer: 100,
        timer: 100,
        [Displays.STORED]: {
          scale: 0.2,
          sourceX: 1957,
          sourceY: 843,
          sourceWidth: 425,
          sourceHeight: 394,
        },
        [Displays.EXAMINED]: {
          sourceX: 1957,
          sourceY: 843,
          sourceWidth: 425,
          sourceHeight: 394,
        }
      },
      HALF_FRIED: {
        name: Names.HALF_FRIED_MEATBALL,
        x: 450,
        y: 300,
        sourceWidth: 218,
        sourceHeight: 124,
        sourceX: 2180,
        sourceY: 1247,
        defaultTimer: 100,
        timer: 100,
      },
      FRIED: {
        name: Names.FRIED_MEATBALL,
        x: 500,
        y: 330,
        sourceWidth: 218,
        sourceHeight: 124,
        sourceX: 2449,
        sourceY: 1251,
      }
    }
  });
  return [
    {
      ...base, // Freezer background
      onClick: function(x, y, gameState) {
        const item = gameState.selectedInventoryItem;
        if (item && item.name === Names.THE_SHINING
          && isWithinRectBounds(x, y, 77, 60, 789, 269)) {
          item.state = item.FINAL;
          gameState.layers[gameState.currentRoom].sprites.push(item);
          gameState.layers[gameState.currentRoom].sprites.push(mincedBeef);
          removeOnce(gameState.inventoryItems, item);
          
          return true;
        }
      },
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
      onClick: function(x, y, gameState) {
        if (this.state === this.INITIAL && this[this.state].isWithinBounds(x, y)) {
          removeOnce(gameState.layers[gameState.currentRoom].sprites, this);
          gameState.inventoryItems.push(this);
          return true;
        }
      },
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