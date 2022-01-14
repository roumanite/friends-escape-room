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
  };

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
    Object.entries(layerInfo).forEach(([name, info], i) => {
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
      ctx.drawImage(
        sprite.img,
        sprite[sprite.state].sourceX, sprite[sprite.state].sourceY, 
        sprite[sprite.state].sourceWidth, sprite[sprite.state].sourceHeight,
        sprite[sprite.state].x, sprite[sprite.state].y, 
        sprite[sprite.state].scale * sprite[sprite.state].sourceWidth, sprite[sprite.state].scale * sprite[sprite.state].sourceHeight,
      );
    }
  }
  

  function renderInventory() {
    ctx.beginPath();
    ctx.fillStyle = Colors.LIGHT_PURPLE;
    ctx.fillRect(0, 677, 955, 100);
  }
}