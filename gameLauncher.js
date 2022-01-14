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

  const entranceTs = loadTilesheet("./assets/entrance.png", function() {
    gameState.layers[Layers.ENTRANCE] = {
      sprites: loadEntrance(entranceTs),
      next: Layers.KITCHEN,
    };
    assetsLoaded++;
    if (assetsLoaded === 2) {
      render();
    }
    console.log(gameState, gameState.layers[gameState.currentRoom]);
  });
  const kitchenTs = loadTilesheet("./assets/kitchen.png", function() {
    gameState.layers[Layers.KITCHEN] = {
      sprites: loadKitchen(kitchenTs),
    };
    assetsLoaded++;
    if (assetsLoaded === 2) {
      render();
    }
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

  function render() {
    renderNavigationArrows();
    renderObjects();
    renderInventory();
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
      var sprite = sprites[i];
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