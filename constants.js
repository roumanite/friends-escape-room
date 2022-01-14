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
  STOVE: 4,
  OVEN: 5,
  FREEZER: 6,
  BOTTOM_FRIDGE: 7,

  LIVING_ROOM: 8,

  MONICAS_ROOM: 9,
  MONICAS_GREEN_DRAWER_1: 10,
  MONICAS_GREEN_DRAWER_2: 11,
  MONICAS_WHITE_DRAWER: 12,
  BIG_BOX: 13,

  GUEST_ROOM: 14,
  GUEST_WHITE_DRAWER_1: 15,
  GUEST_WHITE_DRAWER_2: 16,
  GUEST_WHITE_DRAWER_3: 17,

  BATHROOM: 18,
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