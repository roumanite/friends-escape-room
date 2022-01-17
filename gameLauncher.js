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
    gameOver: false,
    withAnimation: false,
    navigateTo: function(layer) {
      this.currentRoom = layer;
      this.withAnimation = false;
    }
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
      // Store the value beforehand since navigateTo will alter the value
      const withAnimation = gameState.withAnimation;
      gameState.navigateTo(gameState.layers[gameState.currentRoom].previous);
      if (!withAnimation) {
        render();
      }
    }
  }, false)
  const rightArrow = document.getElementsByClassName("right-arrow")[0]
  rightArrow.addEventListener("click", function(e) {
    if (gameState.layers[gameState.currentRoom].next !== undefined) {
      // Store the value beforehand since navigateTo will alter the value
      const withAnimation = gameState.withAnimation;
      gameState.navigateTo(gameState.layers[gameState.currentRoom].next);
      if (!withAnimation) {
        render();
      }
    }
  }, false)

  canvas.addEventListener("click", handleCanvasClick);

  function handleCanvasClick(e) {
    // Store the value beforehand since click scenarios will alter the value
    const withAnimation = gameState.withAnimation;
    handleClickScenarios(e);

    if (inventory.numOfItems(gameState.inventoryItems.length, gameState.page) === 0 && gameState.page > 1) {
      gameState.page -= 1;
    }

    if (!withAnimation) {
      render();
    }
  }

  function handleClickScenarios(e) {
    const x = e.pageX - canvas.offsetLeft - canvas.clientLeft;
    const y = e.pageY - canvas.offsetTop - canvas.clientTop;
    const sprites = gameState.layers[gameState.currentRoom].sprites;
    if (isWithinRectBounds(x, y, 0, 677, 955, 100)) {
      if (isWithinRectBounds(x, y, inventory.prevArrowX, inventory.arrowY, inventory.arrow.width, inventory.arrow.height)) {
        gameState.page -= 1;
        return;
      }
      if (isWithinRectBounds(x, y, inventory.nextArrowX, inventory.arrowY, inventory.arrow.width, inventory.arrow.height)) {
        gameState.page += 1;
        return;
      }

      const numberOfItems = inventory.numOfItems(gameState.inventoryItems.length, gameState.page);

      for (let i = 9 * (gameState.page - 1); i < 9 * (gameState.page - 1) + numberOfItems; i++) {
        const sprite = gameState.inventoryItems[i];
        const x2 = inventory.boxX(canvas.width, numberOfItems, i, gameState.page);
        if (isWithinRectBounds(x, y, x2, 687, 80, 80)) {
          if (gameState.selectedInventoryItem === sprite) {
            gameState.subtitle = '';
            gameState.examinedInventoryItem = sprite;
            gameState.selectedInventoryItem = null;
          } else if (gameState.examinedInventoryItem === sprite) {
            gameState.examinedInventoryItem = null;
          } else {
            gameState.selectedInventoryItem = sprite;
          }
          return;
        }
      }
    }

    if (gameState.examinedInventoryItem) {
      if (isWithinRectBounds(x, y, magnifier.exitX(canvas.width), magnifier.exitY(), magnifier.exit.width, magnifier.exit.height)
        || !isWithinRectBounds(x, y, magnifier.margin, magnifier.margin, canvas.width - magnifier.margin * 2, canvas.height - inventory.slot.margin * 2 - inventory.slot.height - magnifier.margin * 2)
      ) {
        gameState.examinedInventoryItem = null;
        return;
      }
      const sprite = gameState.examinedInventoryItem;

      let topOffset = magnifier.margin + magnifier.padding;

      if (sprite.name.trim().length > 0) {
        ctx.font = `bold ${magnifier.name.fontSize}px Arial`;
        const lines = getLines(ctx, sprite.name, canvas.width - magnifier.margin * 2 - magnifier.padding * 2 - magnifier.exit.width - magnifier.exit.margin);
        topOffset += magnifier.name.fontSize * lines.length + magnifier.name.marginBottom * 2;
      }

      if (sprite.description.trim().length > 0) {
        ctx.font = `${magnifier.desc.fontSize}px Arial`;
        const lines = getLines(ctx, sprite.description, canvas.width - magnifier.margin * 2 - magnifier.padding * 2 - magnifier.exit.width - magnifier.exit.margin);
        topOffset += magnifier.desc.fontSize * lines.length + magnifier.desc.marginBottom;
      }

      const examinedSprite = gameState.examinedInventoryItem && gameState.examinedInventoryItem[gameState.examinedInventoryItem.state][Displays.EXAMINED];

      const width = examinedSprite.scale * examinedSprite.sourceWidth;
      const height = examinedSprite.scale * examinedSprite.sourceHeight;
      const x2 = (canvas.width - width)/2;
      const y2 = (canvas.height - inventory.slot.margin * 2 - inventory.slot.height + topOffset - height)/2;
      
      if (!gameState.examinedInventoryItem.onClick(x - x2, y - y2, gameState) && gameState.selectedInventoryItem) {
        gameState.selectedInventoryItem.onClick(x, y, gameState);
        gameState.selectedInventoryItem = null;
      }
      return;
    }

    if (gameState.subtitle.trim().length > 0) {
      ctx.font = `bold ${subtitleBox.fontSize}px Arial`;
      const lines = getLines(ctx, gameState.subtitle, canvas.width - subtitleBox.padding * 2);
      const height = subtitleBox.calcHeight(lines);
      const topOffset = canvas.height - inventory.slot.margin * 2 - inventory.slot.height - height;
      if (isWithinRectBounds(x, y, canvas.width - subtitleBox.exit.width, topOffset + subtitleBox.padding, subtitleBox.exit.width, subtitleBox.exit.height)) {
        gameState.subtitle = '';
        return;
      } else if (isWithinRectBounds(x, y, 0, topOffset, canvas.width, height)) {
        return;
      }
    }

    gameState.subtitle = '';

    for (let i = sprites.length - 1; i >= 0; i--) {
      if (sprites[i].onClick(x, y, gameState)) {
        break;
      }
    }
    gameState.selectedInventoryItem = null;
  }

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    leftArrow.style.visibility = 'hidden';
    rightArrow.style.visibility = 'hidden';
    
    renderLayer();
    renderSubtitle();
    renderMagnifier();
    renderInventory();
    renderInventoryNavigationArrows();

    if (gameState.gameOver) {
      renderCredits();
      canvas.removeEventListener('click', handleCanvasClick);
      return;
    }
    renderNavigationArrows();
  }

  function renderCredits() {
    ctx.fillStyle = transparentize(Colors.DARK_PURPLE, 0.5);
    ctx.fillRect(20, 20, canvas.width - 20 * 2, canvas.height - inventory.slot.margin * 2 - inventory.slot.height - 20 * 2);
    ctx.fillStyle = Colors.WHITE;
    ctx.font = `bold 30px Arial`;
    ctx.fillText("Congratulations, you have escaped Monica's apartment", 100, 100);
    ctx.fillText("Enjoy a fun day at the beach!", 100, 150);
    ctx.fillText("Thanks to David Crane & Marta Kauffman,", 100, 300);
    ctx.fillText("creator of FRIENDS for inspiring this project", 100, 350);
    ctx.fillText("art, program, puzzle by roumanite", 100, 500);
    ctx.fillText("feedback or bug reports welcomed", 100, 550);
    ctx.font = '25px Arial';
    ctx.fillText("https://www.reddit.com/user/roumanite", 100, 600);
  }

  function renderSubtitle() {
    if (gameState.subtitle.trim().length > 0) {
      console.log(canvas.width - subtitleBox.padding * 2);
      
      ctx.font = `bold ${subtitleBox.fontSize}px Arial`;
      const lines = getLines(ctx, gameState.subtitle, canvas.width - subtitleBox.padding * 2);
      const height = subtitleBox.calcHeight(lines);
      const topOffset = canvas.height - inventory.slot.margin * 2 - inventory.slot.height - height;

      ctx.fillStyle = transparentize(Colors.DARK_PURPLE, 0.2);
      ctx.fillRect(
        0, topOffset,
        canvas.width, height,
      );

      ctx.fillStyle = Colors.WHITE;
      lines.forEach((line, i) => {
        ctx.fillText(
          line,
          subtitleBox.padding,
          topOffset + subtitleBox.marginTop + (subtitleBox.lineHeight + subtitleBox.fontSize) * i,
        );
      });

      ctx.lineWidth = 4;
      ctx.strokeStyle = 'white';
      ctx.moveTo(canvas.width - subtitleBox.exit.width, topOffset + subtitleBox.padding);
      ctx.lineTo(canvas.width - subtitleBox.padding, topOffset + subtitleBox.exit.height);

      ctx.moveTo(canvas.width - subtitleBox.exit.width, topOffset + subtitleBox.exit.height);
      ctx.lineTo(canvas.width - subtitleBox.padding, topOffset + subtitleBox.padding);
      ctx.stroke();
    }
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
    let withAnimation = false;
    const sprites = gameState.layers[gameState.currentRoom].sprites;
    sprites.forEach(sprite => {
      if (typeof sprite.img !== "object") {
        const miniSprites = gameState.layers[sprite.img].sprites;
        miniSprites.forEach(mini => {
          renderSprite(
            mini.img,
            sprite[sprite.state].scale * mini[mini.state].x + sprite[sprite.state].x, sprite[sprite.state].scale * mini[mini.state].y + sprite[sprite.state].y,
            mini[mini.state].sourceX, mini[mini.state].sourceY,
            mini[mini.state].sourceWidth, mini[mini.state].sourceHeight,
            mini[mini.state].rotation, mini[mini.state].scale * sprite[sprite.state].scale,
          );
          if (mini.update(gameState)) {
            withAnimation = true;
          }
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
          if (extra.update(gameState)) {
            withAnimation = true;
          }
        });
      }

      if (sprite.update(gameState)) {
        withAnimation = true;
      }
    });

    if (withAnimation) {
      gameState.withAnimation = true;
      window.requestAnimationFrame(render);
    } else {
      gameState.withAnimation = false;
    }
  }

  function renderMagnifier() {
    if (gameState.examinedInventoryItem) {
      const sprite = gameState.examinedInventoryItem;
      const examinedSprite = sprite[sprite.state][Displays.EXAMINED];
      let topOffset = magnifier.margin + magnifier.padding;
      const leftOffset = magnifier.margin + magnifier.padding;
      
      ctx.fillStyle = transparentize(Colors.DARK_PURPLE, 0.5);
      ctx.fillRect(magnifier.margin, magnifier.margin, canvas.width - magnifier.margin * 2, canvas.height - inventory.slot.margin * 2 - inventory.slot.height - magnifier.margin * 2);
      if (sprite.name.trim().length > 0) {
        ctx.font = `bold ${magnifier.name.fontSize}px Arial`;
        ctx.fillStyle = Colors.WHITE;
        const lines = getLines(ctx, sprite.name, canvas.width - magnifier.margin * 2 - magnifier.padding * 2 - magnifier.exit.width - magnifier.exit.margin);
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
        const lines = getLines(ctx, sprite.description, canvas.width - magnifier.margin * 2 - magnifier.padding * 2 - magnifier.exit.width - magnifier.exit.margin);
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
        magnifier.exitX(canvas.width),
        magnifier.exitY(),
      );
      ctx.lineTo(
        magnifier.exitX(canvas.width) + magnifier.exit.width,
        magnifier.exitY() + magnifier.exit.height,
      );

      ctx.moveTo(
        magnifier.exitX(canvas.width) + magnifier.exit.width,
        magnifier.exitY(),
      );
      ctx.lineTo(
        magnifier.exitX(canvas.width),
        magnifier.exitY() + magnifier.exit.height,
      );
      ctx.stroke();

      const width = examinedSprite.scale * examinedSprite.sourceWidth;
      const height = examinedSprite.scale * examinedSprite.sourceHeight;
      const x = (canvas.width - width)/2;
      const y = (canvas.height - inventory.slot.margin * 2 - inventory.slot.height + topOffset - height)/2;

      renderSprite(
        sprite.img,
        x, y,
        examinedSprite.sourceX, examinedSprite.sourceY,
        examinedSprite.sourceWidth, examinedSprite.sourceHeight,
        examinedSprite.rotation, examinedSprite.scale,
      );

      const sprites = examinedSprite.sprites === undefined ? sprite[sprite.state].sprites : examinedSprite.sprites;

      if (sprites) {
        sprites.forEach(extra => {
          const scale = extra[extra.state].scale * examinedSprite.scale;
          const examinedExtra = extra[extra.state][Displays.EXAMINED];
          renderSprite(
            extra.img,
            x + examinedExtra.x * scale, y + examinedExtra.y * scale,
            examinedExtra.sourceX, examinedExtra.sourceY,
            examinedExtra.sourceWidth, examinedExtra.sourceHeight,
            examinedExtra.rotation, scale,
          );
        });
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
      const storedSprite = sprite[sprite.state][Displays.STORED];
      const x = Math.floor(canvas.width / 2) - (40 * numberOfItems + 5 * (numberOfItems - 1)) + 90 * (i - (gameState.page - 1) * inventory.perPage);
      if (sprite === gameState.selectedInventoryItem) {
        ctx.fillStyle = transparentize(Colors.DARK_PURPLE, 0.7);
      } else {
        ctx.fillStyle = transparentize(Colors.DARK_PURPLE, 0.2);
      }

      ctx.fillRect(x, canvas.height - 100 + 10, inventory.slot.width, inventory.slot.height);

      const width = storedSprite.scale * storedSprite.sourceWidth;
      const height = storedSprite.scale * storedSprite.sourceHeight;
      const spriteX = x + inventory.slot.width / 2 - width / 2;
      const spriteY = canvas.height - 100 + 10 + inventory.slot.height / 2 - height / 2;
      
      renderSprite(
        sprite.img,
        spriteX, spriteY,
        storedSprite.sourceX, storedSprite.sourceY,
        storedSprite.sourceWidth, storedSprite.sourceHeight,
        storedSprite.rotation, storedSprite.scale,
      )

      const sprites = storedSprite.sprites === undefined ? sprite[sprite.state].sprites : storedSprite.sprites;
      if (sprites) {  
        sprites.forEach(extra => {
          const scale = extra[extra.state].scale * storedSprite.scale;
          const storedExtra = extra[extra.state][Displays.STORED];
          renderSprite(
            extra.img,
            spriteX + storedExtra.x * scale, spriteY + storedExtra.y * scale,
            storedExtra.sourceX, storedExtra.sourceY,
            storedExtra.sourceWidth, storedExtra.sourceHeight,
            storedExtra.rotation, scale,
          );
        });
      }
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