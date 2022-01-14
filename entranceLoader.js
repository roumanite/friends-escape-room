function loadEntrance(tilesheet) {
  const base = { img: tilesheet };
  return [
    {
      ...base,
      states: {
        INITIAL: {
          sourceWidth: 955,
          sourceHeight: 677,
        }
      }
    },
    {
      ...base,
      states: {
        INITIAL: {
          scale: 0.15,
          x: 5,
          y: 156,
          sourceX: 957,
          sourceY: 0,
          sourceWidth: 352,
          sourceHeight: 430,
          [Displays.STORED]: {
            scale: 0.2,
          }
        },
        FINAL: {
          x: 520,
          y: 78,
          sourceX: 957,
          sourceY: 0,
          sourceWidth: 352,
          sourceHeight: 430,
          scale: 0.1,
          rotation: 30,
        },
      }
    },
  ].map(props => craftSprite(props));
}