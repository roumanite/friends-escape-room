const transparentize =  (color, opacity) => {
  const lastIndex = color.lastIndexOf('1');

  return color.slice(0, lastIndex) + opacity + color.slice(lastIndex + 1);
};

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
  Object.entries(extendedSprite).forEach(([key, value], i) => {
    sprite[key] = value;
  });
  Object.entries(states).forEach(([stateName, stateProps], i) => {
    sprite[stateName] = i;

    const extStateProps = { ...stateProps };
    Object.entries(stateProps).forEach(([k, v]) => {
      if (typeof v === "object" && spriteObject[spriteObject.INITIAL].hasOwnProperty(k)) {
        extStateProps[k] = {
          ...spriteObject[spriteObject.INITIAL][k],
          ...v,
        };
      }
    });

    sprite[i] = { ...spriteObject[spriteObject.INITIAL], ...extStateProps};
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