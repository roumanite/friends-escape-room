const transparentize =  (color, opacity) => {
  const lastIndex = color.lastIndexOf('1');

  return color.slice(0, lastIndex) + opacity + color.slice(lastIndex + 1);
};

// https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
getLines = (ctx, text, maxWidth) => {
  var words = text.split(" ");
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
    var word = words[i];
    var width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

loadTilesheet = (filename, loadHandler) => {
  const tilesheet = new Image();
  tilesheet.addEventListener("load", loadHandler, false);
  tilesheet.src = filename;
  return tilesheet;
}

isWithinRectBounds = (x1, y1, x2, y2, width, height) => x1 > x2 && x1 < x2 + width && y1 > y2 && y1 < y2 + height;

craftSprite = (props) => {
  let sprite = clone(spriteObject);

  const { states, ...extendedSprite } = props;
  // img, onClick, update
  Object.entries(extendedSprite).forEach(([key, value], i) => {
    sprite[key] = value;
  });
  // states
  Object.entries(states).forEach(([stateName, stateProps], i) => {
    sprite[stateName] = i;

    const extStateProps = { ...spriteObject[spriteObject.INITIAL], ...stateProps };
    // Displays.STORED and EXAMINED
    Object.entries(extStateProps).forEach(([k, v]) => {
      if (typeof v === "object" && spriteObject[spriteObject.INITIAL].hasOwnProperty(k)
        && Object.keys(Displays).includes(k)
      ) {
        extStateProps[k] = {
          ...spriteObject[spriteObject.INITIAL][k],
          x: extStateProps.x,
          y: extStateProps.y,
          sourceX: extStateProps.sourceX,
          sourceY: extStateProps.sourceY,
          sourceWidth: extStateProps.sourceWidth,
          sourceHeight: extStateProps.sourceHeight,
          scale: extStateProps.scale,
          rotation: extStateProps.rotation,
          ...v,
        };
        
      }
    });
    sprite[i] = extStateProps;
  });
  return sprite;
}

function clone(obj) {
  if (null == obj || "object" != typeof obj)
    return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      if (Object.getOwnPropertyDescriptor(obj, attr).value instanceof Object) {
        copy[attr] = clone(obj[attr]);
      } else {
        Object.defineProperty(copy, attr, Object.getOwnPropertyDescriptor(obj, attr));
      }
    }
  }
  return copy;
}

function removeOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function pickUp(x, y, gameState, state = this.INITIAL) {
  if (gameState.examinedInventoryItem !== this
    && gameState.selectedInventoryItem !== this
    && this.state === state
    && this[this.state].isWithinBounds(x, y)
  ) {
    removeOnce(gameState.layers[gameState.currentRoom].sprites, this);
    gameState.inventoryItems.push(this);
    return true;
  }
  return false;
};

function combo(gameState, sprite1, sprite2Name) {
  if (gameState.examinedInventoryItem === sprite1 && gameState.selectedInventoryItem && gameState.selectedInventoryItem.name === sprite2Name) {
    return gameState.selectedInventoryItem;
  }
  if (gameState.selectedInventoryItem === sprite1 && gameState.examinedInventoryItem && gameState.examinedInventoryItem.name === sprite2Name) {
    return gameState.examinedInventoryItem;
  }
  return false;
}