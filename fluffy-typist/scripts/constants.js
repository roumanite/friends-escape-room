const NON_TEXT = 'NON-TEXT';
const TEXT = 'TEXT';
const SHAPE = 'SHAPE';

const spriteBase =
{
  img: null,
  INITIAL: 0,
  type: NON_TEXT,
};
spriteBase.state = spriteBase.INITIAL;
spriteBase[spriteBase.INITIAL] = {
  x: 0,
  y: 0,
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 0,
  sourceHeight: 0,
  scale: 1,
  rotation: 0,
};

const textBase = {
  type: TEXT,
  font: '',
  baseline: 'top',
}

const rectBase = {
  type: SHAPE,
  width: 100,
  height: 100,
  x: 0,
  y: 0,
}

const stateBase = {
  sprites: [],
  update: () => {},
  listeners: {},
}