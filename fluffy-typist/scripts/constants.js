const NON_TEXT = 'NON-TEXT';
const TEXT = 'TEXT';

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