function loadKitchen(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      states: {
        INITIAL: {
          sourceWidth: 955,
          sourceHeight: 677,
        },
      }
    },
  ].map(props => craftSprite(props));
}