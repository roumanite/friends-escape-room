launch();

function launch() {
  const tilesheetsNum = 2;
  let assetsLoaded = 0;
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  const gameState = {
    selectedInventoryItem: null,
    examinedInventoryItem: null,
    currentRoom: Layers.ENTRANCE,
    inventoryItems: [],
    layers: {},
    subtitle: '',
    page: 1,
  };

  // Game rendition constants
  const inventory = {
    arrow: {
      width: 40,
      marginLeft: 18,
      marginRight: 20,
    },
    slot: {
      width: 80,
      height: 80,
      margin: 10,
    }
  }
  inventory.perPage = Math.floor(
    (canvas.width - (inventory.arrow.width + inventory.arrow.marginLeft + inventory.arrow.marginRight) * 2) / inventory.slot.width,
  );

  loadTilesheet("./assets/entrance.png", function() {
    handleTilesheetOnload({
      [Layers.ENTRANCE]: {
        sprites: loadEntrance(this),
        next: Layers.KITCHEN,
      }
    });
  });
  loadTilesheet("./assets/kitchen.png", function() {
    handleTilesheetOnload({
      [Layers.KITCHEN]: {
        sprites: loadKitchen(this),
        previous: Layers.ENTRANCE,
      },
      [Layers.STOVE]: {
        sprites: loadStove(this),
        previous: Layers.KITCHEN,
      },
      [Layers.OVEN]: {
        sprites: loadOven(this),
        previous: Layers.KITCHEN,
      },
      [Layers.KITCHEN_BLUE_DRAWER_1]: {
        sprites: loadBlueDrawer1(this),
        previous: Layers.KITCHEN,
      },
      [Layers.KITCHEN_BLUE_DRAWER_2]: {
        sprites: loadBlueDrawer2(this),
        previous: Layers.KITCHEN,
      },
      [Layers.FREEZER]: {
        sprites: loadFreezer(this),
        previous: Layers.KITCHEN,
      },
      [Layers.BOTTOM_FRIDGE]: {
        sprites: loadBottomFridge(this),
        previous: Layers.KITCHEN,
      }
    });
  });

  const leftArrow = document.getElementsByClassName("left-arrow")[0]
  leftArrow.addEventListener("click", function(e) {
    if (gameState.layers[gameState.currentRoom].previous !== undefined) {
      gameState.currentRoom = gameState.layers[gameState.currentRoom].previous;
      render();
    }
  }, false)
  const rightArrow = document.getElementsByClassName("right-arrow")[0]
  rightArrow.addEventListener("click", function(e) {
    if (gameState.layers[gameState.currentRoom].next !== undefined) {
      gameState.currentRoom = gameState.layers[gameState.currentRoom].next
      render();
    }
  }, false)

  window.addEventListener("click", function(e) {
    const x = e.pageX - canvas.offsetLeft- canvas.clientLeft;
    const y = e.pageY - canvas.offsetTop-canvas.clientTop;
    const sprites = gameState.layers[gameState.currentRoom].sprites;

    for (let i = sprites.length-1; i >= 0; i--) {
      if (sprites[i].onClick(x, y, gameState)) {
        render();
        break;
      }
    }
  });

  function handleTilesheetOnload(layerInfo) {
    Object.entries(layerInfo).forEach(([name, info]) => {
      gameState.layers[name] = info;
    });
    assetsLoaded++;
    if (assetsLoaded === tilesheetsNum) {
      render();
    }
  }

  function render() {
    renderNavigationArrows();
    renderObjects();
    renderInventory();
    //ctx.fillStyle = transparentize(Colors.LIGHT_PURPLE, 0.5);
  }

  function renderNavigationArrows() {
    if (gameState.layers[gameState.currentRoom].next !== undefined) {
      rightArrow.style.visibility = 'visible';
    } else {
      rightArrow.style.visibility = 'hidden';
    }
    if (gameState.layers[gameState.currentRoom].previous !== undefined) {
      leftArrow.style.visibility = 'visible';
    } else {
      leftArrow.style.visibility = 'hidden';
    }
  }

  function renderObjects() {
    const sprites = gameState.layers[gameState.currentRoom].sprites;
    for(let i = 0; i < sprites.length; i++)
    {
      const sprite = sprites[i];
      if (typeof sprite.img !== "object") {
        const miniSprites = gameState.layers[sprite.img].sprites;
        miniSprites.forEach(mini => {
          ctx.drawImage(
            mini.img,
            mini[mini.state].sourceX, mini[mini.state].sourceY, 
            mini[mini.state].sourceWidth, mini[mini.state].sourceHeight,
            sprite[sprite.state].scale * mini[mini.state].x + sprite[sprite.state].x, sprite[sprite.state].scale * mini[mini.state].y + sprite[sprite.state].y, 
            sprite[sprite.state].scale * mini[mini.state].scale * mini[mini.state].sourceWidth, sprite[sprite.state].scale * mini[mini.state].scale * mini[mini.state].sourceHeight,
          );
        });
      } else {
        ctx.drawImage(
          sprite.img,
          sprite[sprite.state].sourceX, sprite[sprite.state].sourceY, 
          sprite[sprite.state].sourceWidth, sprite[sprite.state].sourceHeight,
          sprite[sprite.state].x, sprite[sprite.state].y, 
          sprite[sprite.state].scale * sprite[sprite.state].sourceWidth, sprite[sprite.state].scale * sprite[sprite.state].sourceHeight,
        );
      }
      if (sprite[sprite.state].sprites) {  
        sprite[sprite.state].sprites.forEach(extra => {
          ctx.drawImage(
            extra.img,
            extra[extra.state].sourceX, extra[extra.state].sourceY, 
            extra[extra.state].sourceWidth, extra[extra.state].sourceHeight,
            extra[extra.state].x + sprite[sprite.state].x, extra[extra.state].y + sprite[sprite.state].y, 
            extra[extra.state].scale * extra[extra.state].sourceWidth, extra[extra.state].scale * extra[extra.state].sourceHeight,
          );
        });
      }

      if (sprite[sprite.state].update()) {
        window.requestAnimationFrame(render);
      }
    }
  }

  function renderInventory() {
    ctx.beginPath();
    ctx.fillStyle = Colors.LIGHT_PURPLE;
    ctx.fillRect(0, 677, 955, 100);

    const numberOfItems = gameState.inventoryItems.length % (gameState.page * inventory.perPage) < gameState.inventoryItems.length ?
      inventory.perPage : gameState.inventoryItems.length - (gameState.page - 1) * inventory.perPage;

    for (let i = inventory.perPage * (gameState.page - 1); i < 9 * (gameState.page - 1) + numberOfItems; i++) {
      const sprite = gameState.inventoryItems[i];
      const x = Math.floor(canvas.width / 2) - (40 * numberOfItems + 5 * (numberOfItems - 1)) + 90 * (i - (gameState.page - 1) * inventory.perPage);
      if (sprite === gameState.selectedInventoryItem) {
        ctx.fillStyle = transparentize(Colors.DARK_PURPLE, 0.7);
      } else {
        ctx.fillStyle = transparentize(Colors.DARK_PURPLE, 0.2);
      }

      ctx.fillRect(x, canvas.height - 100 + 10, inventory.slot.width, inventory.slot.height);

      const srcX = sprite[sprite.state][Displays.STORED].sourceX !== undefined ? sprite[sprite.state][Displays.STORED].sourceX : sprite[sprite.state].sourceX;
      const srcY = sprite[sprite.state][Displays.STORED].sourceY !== undefined ? sprite[sprite.state][Displays.STORED].sourceY : sprite[sprite.state].sourceY;
      const srcWidth = sprite[sprite.state][Displays.STORED].sourceWidth !== undefined ? sprite[sprite.state][Displays.STORED].sourceWidth : sprite[sprite.state].sourceWidth;
      const srcHeight = sprite[sprite.state][Displays.STORED].sourceHeight !== undefined ? sprite[sprite.state][Displays.STORED].sourceHeight : sprite[sprite.state].sourceHeight;
      const width = sprite[sprite.state][Displays.STORED].scale * srcWidth;
      const height = sprite[sprite.state][Displays.STORED].scale * srcHeight;
      
      ctx.drawImage(
        sprite.img,
        srcX, srcY, 
        srcWidth, srcHeight,
        x + inventory.slot.width / 2 - width / 2, canvas.height - 100 + 10 + inventory.slot.height/2 - height/2,
        width, height,
      );
    }
  }
}