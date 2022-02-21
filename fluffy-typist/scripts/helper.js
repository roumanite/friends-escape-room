loadTilesheet = (filename, loadHandler) => {
  const tilesheet = new Image();
  tilesheet.addEventListener("load", loadHandler, false);
  tilesheet.src = filename;
  return tilesheet;
}

loadFont = (filename, nickname, loadHandler) => {
  new FontFace(nickname, `url(${filename})`).load().then(loadHandler);
}

getTextWidth = (canvas, sprite) => {
  const ctx = canvas.getContext("2d");
  ctx.font = sprite.font;
  return ctx.measureText(sprite.text).width;
}

centerSpriteHorizontally = (canvas, sprite) => {
  if (sprite.type === Types.IMAGE) {
    return canvas.width/2 - sprite.sourceWidth * sprite.scale/2;
  } else if (sprite.type === Types.TEXT) {
    return canvas.width/2 - getTextWidth(canvas, sprite)/2;
  }
  return canvas.width/2 - sprite.width/2;
}

centerSpriteVertically = (canvas, sprite) => {
  if (sprite.type === Types.IMAGE) {
    return canvas.height/2 - sprite.sourceHeight * sprite.scale/2;
  } else if (sprite.type === Types.TEXT) {
    const ctx = canvas.getContext("2d");
    ctx.font = sprite.font;
    const metrics = ctx.measureText(sprite.text);
    const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    return canvas.height/2 - actualHeight/2;
  }
  return canvas.height/2 - sprite.height/2;
}

createSprite = (props) => {
  let sprite;
  switch(props.type) {
    case Types.TEXT:
    case Types.WORD_SPAWN:
      sprite = { ...textBase, ...props };
      break;
    case Types.RECTANGULAR:
      sprite = { ...rectBase, ...props };
      break;
    case Types.IMAGE:
      let coreProps = [];
      sprite = clone(artBase);

      const { states, ...extendedSprite } = props;

      Object.entries(extendedSprite).forEach(([key, value], i) => {
        sprite[key] = value;
      });
      // states
      Object.entries(states).forEach(([stateName, stateProps], i) => {
        sprite[stateName] = i;
    
        const extStateProps = { ...artBase[artBase.INITIAL], ...stateProps };

        Object.keys(extStateProps).forEach(key => {  
          coreProps.push(key);
        });
        sprite[i] = extStateProps;
      });

      new Set(coreProps).forEach(prop => {
        Object.defineProperty(sprite, prop, { get: function() {
          return sprite[sprite.state][prop];
        }});
      });
      return sprite;
    default:
      break;
  }
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