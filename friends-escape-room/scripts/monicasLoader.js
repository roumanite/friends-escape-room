function loadMonicas(tilesheet) {
  const base = { img: tilesheet };
  return [ // Monica's bedroom background
    {
      ...base,
      onClick: function(x, y, gameState) {
          if (isWithinRectBounds(x, y, 28, 5, 166, 369)) {
            gameState.navigateTo(Layers.LIVING_ROOM);
            return true;
          }
          if (isWithinRectBounds(x, y, 224, 281, 143, 42)) {
            gameState.navigateTo(Layers.MONICAS_GREEN_DRAWER_1);
            return true;
          }
          if (isWithinRectBounds(x, y, 226, 319, 138, 43)) {
            gameState.navigateTo(Layers.MONICAS_GREEN_DRAWER_2);
            return true;
          }
          if (isWithinRectBounds(x, y, 0, 436, 188, 237)
            || isWithinRectBounds(x, y, 204, 374, 129, 122)) {
            gameState.navigateTo(Layers.BIG_BOX);
            return true;
          }
          if (isWithinRectBounds(x, y, 760, 262, 158, 46)) {
            gameState.navigateTo(Layers.MONICAS_WHITE_DRAWER);
            return true;
          }
          if (isWithinRectBounds(x, y, 750, 194, 131, 65)) {
            gameState.subtitle = 'Is that message old or new? Old or new?!';
            return true;
          }
      },
      states: {
        INITIAL: {
          x: 0,
          y: 0,
          sourceWidth: 955,
          sourceHeight: 677,
        }
      }
    },
    { // Coaster
      ...base,
      onClick: pickUp,
      states: {
        INITIAL: {
          name: Names.COASTER,
          x: 520,
          y: 350,
          sourceX: 1556,
          sourceY: 693,
          sourceWidth: 424,
          sourceHeight: 397,
          scale: 0.1,
          [Displays.STORED]: { scale: 0.15 },
          [Displays.EXAMINED]: { scale: 1 },
        },
        FINAL: {
          x: 630,
          y: 460,
          sourceX: 1642,
          sourceY: 1135,
          sourceWidth: 169,
          sourceHeight: 92,
          scale: 0.5,
        },
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
          x: 380,
          y: 300,
          sourceX: 1009,
          sourceY: 1431,
          sourceWidth: 173,
          sourceHeight: 99,
        },
        LIFTED: {
          x: 380,
          y: 250,
          sourceX: 1009,
          sourceY: 1431,
          sourceWidth: 173,
          sourceHeight: 99,
        },
      }
    },
    { // Pillow 2
      ...base,
      onClick: function(x, y) {
        if (this[this.state].isWithinBounds(x, y)) {
          if (this.state === this.INITIAL) {
            this.state = this.LIFTED;
          } else {
            this.state = this.INITIAL;
          }
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 530,
          y: 300,
          sourceX: 1009,
          sourceY: 1431,
          sourceWidth: 173,
          sourceHeight: 99,
        },
        LIFTED: {
          x: 530,
          y: 250,
          sourceX: 1009,
          sourceY: 1431,
          sourceWidth: 173,
          sourceHeight: 99,
        },
      },
    },
  ].map(sprite => craftSprite(sprite));
}

function loadMonicasGreenDrawer1(tilesheet) {
  const base = { img: tilesheet };
  return [
    { // Background
      ...base,
      states: {
        INITIAL: {
          x: 0,
          y: 0,
          sourceWidth: 955,
          sourceHeight: 677,
          sourceX: 0,
          sourceY: 710,
        },
      }
    },
    { // Rubber bands
      ...base,
      onClick: pickUp,
      states: {
        INITIAL: {
          name: Names.RUBBER_BANDS,
          description: 'Could it BE more elastic?',
          x: 250,
          y: 150,
          sourceWidth: 368,
          sourceHeight: 317,
          sourceX: 1000,
          sourceY: 695,
          [Displays.STORED]: { scale: 0.2 },
        }
      }
    },
  ].map(sprite => craftSprite(sprite));
}

function loadMonicasGreenDrawer2(tilesheet) {
  return [
    {
      img: tilesheet,
      states: {
        INITIAL: {
          x: 0,
          y: 0,
          sourceWidth: 955,
          sourceHeight: 677,
          sourceX: 0,
          sourceY: 710,
        },
      }
    }
  ].map(sprite => craftSprite(sprite));
}

function loadMonicasWhiteDrawer(tilesheet) {
  return [
    { // Background
      img: tilesheet,
      states: {
        INITIAL: {
          x: 0,
          y: 0,
          sourceWidth: 955,
          sourceHeight: 677,
          sourceX: 0,
          sourceY: 1419,
        },
      }
    },
    { // Chopsticks
      img: tilesheet,
      onClick: function(x, y, gameState) {
        if (pickUp.bind(this)(x, y, gameState)) {
          return true;
        }
        const rubberBands = combo(gameState, this, Names.RUBBER_BANDS);
        if (rubberBands) {
          this.state = this.FINAL;
          removeOnce(gameState.inventoryItems, rubberBands);
          gameState.examinedInventoryItem = this;
          return true;
        }
      },
      states: {
        INITIAL: {
          name: Names.CHOPSTICKS,
          description: 'Well, now we got a reason',
          x: 235,
          y: 200,
          sourceWidth: 488,
          sourceHeight: 384,
          sourceX: 978,
          sourceY: 1020,
          [Displays.STORED]: { scale: 0.15 },
        },
        FINAL: {
          name: Names.GIANT_POKING_DEVICE,
          description: "Let's poke",
          x: 235,
          y: 200,
          sourceWidth: 650,
          sourceHeight: 411,
          sourceX: 1000,
          sourceY: 1615,
          [Displays.STORED]: { scale: 0.11 },
        }
      }
    },
  ].map(sprite => craftSprite(sprite));
}

function loadBigBox(tilesheet) {
  const base = { img: tilesheet };
  const glasses = craftSprite({
    ...base,
    onClick: pickUp,
    states: {
      INITIAL: {
        name: Names.CHANDLER_GLASSES,
        sourceWidth: 440,
        sourceHeight: 223,
        sourceX: 1478,
        sourceY: 1317,
        rotation: 90,
        x: 50,
        y: 200,
        [Displays.STORED]: {
          rotation: 0,
          scale: 0.2,
        },
        [Displays.EXAMINED]: { rotation: 0 }
      }
    }
  });

  return [
    { // Background
      ...base,
      onClick: function(x, y, gameState) {
        const item = gameState.selectedInventoryItem;
        if (item && item.name === Names.CHANDLER_FIGURINE) {
          item.state = item.FINAL;
          removeOnce(gameState.inventoryItems, item);
          gameState.layers[gameState.currentRoom].sprites.push(glasses);
          gameState.layers[gameState.currentRoom].sprites.push(item);
          return true;
        }
      },
      states: {
        INITIAL: {
          x: 0,
          y: 0,
          sourceWidth: 955,
          sourceHeight: 677,
          sourceX: 973,
          sourceY: 0,
        },
      }
    },
  ].map(sprite => craftSprite(sprite));
}