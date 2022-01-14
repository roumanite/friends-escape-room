const Colors = {
  LIGHT_PURPLE: 'rgba(221, 215, 237, 1)',
};

const Displays = {
  STORED: 'STORED',
  EXAMINED: 'EXAMINED',
};

const Layers = {
  ENTRANCE: 0,

  KITCHEN: 1,
  KITCHEN_BLUE_DRAWER_1: 2,
  KITCHEN_BLUE_DRAWER_2: 3,
  STOVE: 2,
  OVEN: 3,
  FREEZER: 4,
  BOTTOM_FRIDGE: 5,

  LIVING_ROOM: 6,

  MONICAS_ROOM: 7,
  MONICAS_GREEN_DRAWER_1: 8,
  MONICAS_GREEN_DRAWER_2: 9,
  MONICAS_WHITE_DRAWER: 10,
  BIG_BOX: 11,

  GUEST_ROOM: 12,
  GUEST_WHITE_DRAWER_1: 13,
  GUEST_WHITE_DRAWER_2: 14,
  GUEST_WHITE_DRAWER_3: 15,

  BATHROOM: 16,
};

const base =
{
  img: null,
  INITIAL: 0,
  onClick: function() {
    return false;
  },
};
base.state = base.INITIAL;
const spriteObject = {
  ...base,
  get name() {
    return this[this.state].name || this[this.INITIAL].name;
  },
  get description() {
    return this[this.state].description || this[this.INITIAL].description;
  },
};
spriteObject[spriteObject.INITIAL] = {
  name: '',
  description: '',
  x: 0,
  y: 0,
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 0,
  sourceHeight: 0,
  scale: 1,
  rotation: 0,
  [Displays.STORED]: {
    scale: 1,
    rotation: 0,
  },
  [Displays.EXAMINED]: {
    scale: 1,
    rotation: 0,
  },
  isWithinBounds: function(x, y) {
    return isWithinRectBounds(x, y, this.x, this.y, this.sourceWidth * this.scale, this.sourceHeight * this.scale);
  },
};