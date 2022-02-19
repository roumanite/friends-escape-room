const transparentize =  (color, opacity) => {
  const lastIndex = color.lastIndexOf('1');

  return color.slice(0, lastIndex) + opacity + color.slice(lastIndex + 1);
};