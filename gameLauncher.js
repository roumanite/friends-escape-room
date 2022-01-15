launch();

function launch() {
  const tilesheetsNum = 3;
  let assetsLoaded = 0;
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";

  const gameState = {
    selectedInventoryItem: null,
    examinedInventoryItem: null,
    currentRoom: Layers.ENTRANCE,
    inventoryItems: [],
    layers: {},
    subtitle: '',
    page: 1,
  };

  inventory.perPage = Math.floor(
    (canvas.width - (inventory.arrow.width + inventory.arrow.marginLeft + inventory.arrow.marginRight) * 2) /
    (inventory.slot.width + inventory.slot.margin - 1),
  );

  inventory.prevArrowX = inventory.arrow.marginLeft;
  inventory.nextArrowX = inventory.arrow.marginLeft * 2 + inventory.arrow.marginRight +
    inventory.arrow.width + (inventory.slot.width * inventory.perPage + inventory.slot.margin * (inventory.perPage-1));
  inventory.arrowY = canvas.height - inventory.slot.height - inventory.slot.margin;

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
        next: Layers.LIVING_ROOM,
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
  loadTilesheet("./assets/living_room.png", function() {
    handleTilesheetOnload({
      [Layers.LIVING_ROOM]: {
        sprites: loadLivingRoom(this),
        previous: Layers.KITCHEN,
        next: Layers.BATHROOM,
      },
      [Layers.LAPTOP]: {
        sprites: loadLaptop(this),
        previous: Layers.LIVING_ROOM,
      }
    })
  });
  loadTilesheet("./assets/monicas_room.png", function() {
    handleTilesheetOnload({
      [Layers.MONICAS_ROOM]: {
        sprites: loadMonicas(this),
      },
      [Layers.MONICAS_GREEN_DRAWER_1]: {
        sprites: loadMonicasGreenDrawer1(this),
        previous: Layers.MONICAS_ROOM,
      },
      [Layers.MONICAS_GREEN_DRAWER_2]: {
        sprites: loadMonicasGreenDrawer2(this),
        previous: Layers.MONICAS_ROOM,
      },
      [Layers.MONICAS_WHITE_DRAWER]: {
        sprites: loadMonicasWhiteDrawer(this),
        previous: Layers.MONICAS_ROOM,
      },
      [Layers.BIG_BOX]: {
        sprites: loadBigBox(this),
        previous: Layers.MONICAS_ROOM,
      }
    })
  });
  loadTilesheet("./assets/guest_room.png", function() {
    handleTilesheetOnload({
      [Layers.GUEST_ROOM]: {
        sprites: loadGuestRoom(this),
      },
      [Layers.GUEST_WHITE_DRAWER_1]: {
        sprites: loadGuestWhiteDrawer1(this),
        previous: Layers.GUEST_ROOM,
      },
      [Layers.GUEST_WHITE_DRAWER_2]: {
        sprites: loadGuestWhiteDrawer2(this),
        previous: Layers.GUEST_ROOM,
      },
      [Layers.GUEST_WHITE_DRAWER_3]: {
        sprites: loadGuestWhiteDrawer3(this),
        previous: Layers.GUEST_ROOM,
      }
    })
  });
  loadTilesheet("./assets/bathroom.png", function() {
    handleTilesheetOnload({
      [Layers.BATHROOM]: {
        sprites: loadBathroom(this),
        previous: Layers.LIVING_ROOM,
      },
    })
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
    const x = e.pageX - canvas.offsetLeft - canvas.clientLeft;
    const y = e.pageY - canvas.offsetTop - canvas.clientTop;
    const sprites = gameState.layers[gameState.currentRoom].sprites;

    if (isWithinRectBounds(x, y, 0, 677, 955, 100)) {
      if (isWithinRectBounds(x, y, inventory.prevArrowX, inventory.arrowY, inventory.arrow.width, inventory.arrow.height)) {
        gameState.page -= 1;
        render();
        return;
      }
      if (isWithinRectBounds(x, y, inventory.nextArrowY, inventory.arrowY, inventory.arrow.width, inventory.arrow.height)) {
        gameState.page += 1;
        render();
        return;
      }

      const numberOfItems = inventory.numOfItems(gameState.inventoryItems.length, gameState.page);

      for (let i = 9 * (gameState.page - 1); i < 9 * (gameState.page - 1) + numberOfItems; i++) {
        const sprite = gameState.inventoryItems[i];
        const x2 = inventory.boxX(canvas.width, numberOfItems, i, gameState.page);
        if (isWithinRectBounds(x, y, x2, 687, 80, 80)) {
          if (gameState.selectedInventoryItem === sprite) {
            gameState.examinedInventoryItem = sprite;
            gameState.selectedInventoryItem = null;
          } else if (gameState.examinedInventoryItem === sprite) {
            gameState.examinedInventoryItem =null;
          } else {
            gameState.selectedInventoryItem = sprite;
          }
          
          render();
          return;
        }
      }
    }

    if (gameState.examinedInventoryItem) {
      if (isWithinRectBounds(x, y, magnifier.x(canvas.width), magnifier.y(), magnifier.exit.width, magnifier.exit.height)) {
        gameState.examinedInventoryItem = null;
        render();
        return;
      }
    }

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
    renderLayer();
    renderMagnifier();
    renderInventory();
    renderInventoryNavigationArrows();
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

  function renderLayer() {
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
        renderSprite(
          sprite.img,
          sprite[sprite.state].x, sprite[sprite.state].y,
          sprite[sprite.state].sourceX, sprite[sprite.state].sourceY,
          sprite[sprite.state].sourceWidth, sprite[sprite.state].sourceHeight,
          sprite[sprite.state].rotation, sprite[sprite.state].scale,
        );
      }
      if (sprite[sprite.state].sprites) {  
        sprite[sprite.state].sprites.forEach(extra => {
          renderSprite(
            extra.img,
            extra[extra.state].x + sprite[sprite.state].x, extra[extra.state].y + sprite[sprite.state].y,
            extra[extra.state].sourceX, extra[extra.state].sourceY,
            extra[extra.state].sourceWidth, extra[extra.state].sourceHeight,
            extra[extra.state].rotation, extra[extra.state].scale,
          );
        });
      }

      if (sprite[sprite.state].update()) {
        window.requestAnimationFrame(render);
      }
    }
  }

  function renderMagnifier() {
    if (gameState.examinedInventoryItem) {
      const sprite = gameState.examinedInventoryItem;
      let topOffset = magnifier.margin + magnifier.padding;
      const leftOffset = magnifier.margin + magnifier.padding;
      
      ctx.fillStyle = transparentize(Colors.DARK_PURPLE, 0.5);
      ctx.fillRect(magnifier.margin, magnifier.margin, canvas.width - magnifier.margin * 2, canvas.height - inventory.slot.margin * 2 - inventory.slot.height - magnifier.margin * 2);
      if (sprite.name.trim().length > 0) {
        ctx.font = `${magnifier.name.fontSize}px Arial`;
        ctx.fillStyle = Colors.WHITE;
        const lines = getLines(ctx, sprite.name, canvas.width - magnifier.margin * 2 - magnifier.padding * 2);
        lines.forEach((line, i) => {
          ctx.fillText(line, leftOffset, magnifier.margin + magnifier.padding + magnifier.name.fontSize * i);
          topOffset += magnifier.name.fontSize;
        });
        
        topOffset += magnifier.name.marginBottom;

        ctx.lineWidth = 4;
        ctx.strokeStyle = Colors.WHITE;
        ctx.beginPath();
        ctx.moveTo(magnifier.margin + magnifier.padding, topOffset);
        ctx.lineTo(canvas.width - magnifier.margin * 2 - magnifier.exit.width - magnifier.padding, topOffset);
        ctx.stroke();

        topOffset += magnifier.name.marginBottom;
      }

      if (sprite.description.trim().length > 0) {
        ctx.font = `${magnifier.desc.fontSize}px Arial`;
        ctx.fillStyle = Colors.WHITE;
        const lines = getLines(ctx, sprite.description, canvas.width - magnifier.margin * 2 - magnifier.padding * 2);
        lines.forEach((line, i) => {
          ctx.fillText(line, leftOffset, topOffset + magnifier.desc.fontSize * i);
          topOffset += magnifier.desc.fontSize;
        });
        topOffset += magnifier.desc.marginBottom;
      }

      ctx.lineWidth = 4;
      ctx.strokeStyle = Colors.WHITE;
      ctx.beginPath();
      ctx.moveTo(
        magnifier.x(canvas.width),
        magnifier.y(),
      );
      ctx.lineTo(
        magnifier.x(canvas.width) + magnifier.exit.width,
        magnifier.y() + magnifier.exit.height,
      );

      ctx.moveTo(
        magnifier.x(canvas.width) + magnifier.exit.width,
        magnifier.y(),
      );
      ctx.lineTo(
        magnifier.x(canvas.width),
        magnifier.y() + magnifier.exit.height,
      );
      ctx.stroke();

      const srcX = sprite[sprite.state][Displays.EXAMINED].sourceX !== undefined ? sprite[sprite.state][Displays.EXAMINED].sourceX : sprite[sprite.state].sourceX;
      const srcY = sprite[sprite.state][Displays.EXAMINED].sourceY !== undefined ? sprite[sprite.state][Displays.EXAMINED].sourceY : sprite[sprite.state].sourceY;
      const srcWidth = sprite[sprite.state][Displays.EXAMINED].sourceWidth !== undefined ? sprite[sprite.state][Displays.EXAMINED].sourceWidth : sprite[sprite.state].sourceWidth;
      const srcHeight = sprite[sprite.state][Displays.EXAMINED].sourceHeight !== undefined ? sprite[sprite.state][Displays.EXAMINED].sourceHeight : sprite[sprite.state].sourceHeight;
      const width = sprite[sprite.state][Displays.EXAMINED].scale * srcWidth;
      const height = sprite[sprite.state][Displays.EXAMINED].scale * srcHeight;
      const x = (canvas.width - width)/2;
      const y = (canvas.height - inventory.slot.margin * 2 - inventory.slot.height + topOffset - height)/2;

      ctx.drawImage(
        sprite.img,
        srcX, srcY,
        srcWidth, srcHeight,
        x, y,
        width, height,
      );
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
      
      renderSprite(
        sprite.img,
        x + inventory.slot.width / 2 - width / 2, canvas.height - 100 + 10 + inventory.slot.height / 2 - height / 2,
        srcX, srcY,
        srcWidth, srcHeight,
        sprite[sprite.state][Displays.STORED].rotation, sprite[sprite.state][Displays.STORED].scale,
      )
    }
  }

  function renderInventoryNavigationArrows() {
    // Previous arrow
    if (gameState.page > 1) {
      ctx.beginPath();
      ctx.fillStyle = transparentize(Colors.DARK_PURPLE, 0.2);
      ctx.moveTo(inventory.prevArrowX, inventory.arrowY + inventory.arrow.width)
      ctx.lineTo(inventory.prevArrowX + inventory.arrow.width, inventory.arrowY)
      ctx.lineTo(inventory.prevArrowX + inventory.arrow.width, inventory.arrowY + inventory.arrow.height)
      ctx.fill()
    }
    // Next arrow
    if (gameState.inventoryItems.length > inventory.perPage * gameState.page) {
      ctx.beginPath();
      ctx.fillStyle = transparentize(Colors.DARK_PURPLE, 0.2);
      ctx.moveTo(inventory.nextArrowX, inventory.arrowY)
      ctx.lineTo(inventory.nextArrowX + inventory.arrow.width, inventory.arrowY + 40)
      ctx.lineTo(inventory.nextArrowX, inventory.arrowY + 80)
      ctx.fill()
    }
  }

  function renderSprite(
    img,
    x, y,
    sourceX, sourceY,
    sourceWidth, sourceHeight,
    rotation, scale,
  ) {
    if (rotation > 0) {
      ctx.save();
  
      const width = scale * sourceWidth;
      const height = scale * sourceHeight;
    
      // Rotate the canvas
      ctx.translate(
        Math.ceil(x + (width / 2)), 
        Math.ceil(y + (height / 2))
      );
    
      ctx.rotate(rotation * Math.PI / 180);
      
      ctx.drawImage(
        img,
        sourceX, sourceY, 
        sourceWidth, sourceHeight,
        Math.ceil(-width / 2), Math.ceil(-height / 2),
        width, height,
      );
    
      // Restore the drawing surface to its state before it was rotated
      ctx.restore();
    } else {
      ctx.drawImage(
        img,
        sourceX, sourceY, 
        sourceWidth, sourceHeight,
        x, y, 
        scale * sourceWidth, scale * sourceHeight,
      );
    }
  }
}