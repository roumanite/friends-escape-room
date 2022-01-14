launch();

function launch() {
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
    render();
    console.log(gameState, gameState.layers[gameState.currentRoom]);
  });

  function render() {
    renderObjects();
    renderInventory();
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