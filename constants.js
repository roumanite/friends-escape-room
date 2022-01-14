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

const Names = {
  // Entrance
  CHANDLER_GLASSES: "Chandler's glasses",
  BABY_DOLL_BROWN: 'Baby doll wearing brown',

  // Kitchen
  MINCED_BEEF: 'Minced Beef',
  RAW_MEATBALL: 'Raw Meatball',
  MOZARELLA_CHEESE: 'Mozarella Cheese',
  FRYING_PAN: 'Frying Pan',
  FIRE: 'Fire',

  // Living room items
  TABLE: 'Table',
  CUP: 'Cup',
  EGG: 'Egg',
  BABY_DOLL_WHITE: 'Baby doll wearing white',
  MEATBALL_CLAMP: 'Meatball Clamp',
  MARINARA_SAUCE: 'A Jar of Marinara Sauce', // Half the taste is in the smell
  CHANDLER_FIGURINE: 'Chandler Bing Figurine',

  // Monica's room items
  RUBBER_BANDS: 'Rubber bands',
  MIDORI: 'Midori',
  CHOPSTICKS: 'Chopsticks',
  COASTER: 'Coaster',
  GIANT_POKING_DEVICE: 'Giant poking device',

  // Guest room items
  THE_SHINING: 'The Shining',
  BREADCRUMBS: 'Breadcrumbs',
  OTTOMAN: 'The Green Ottoman',
  COOKING_OIL: 'Cooking Oil',
  BABY_DOLL_BLACK: 'Baby doll wearing black',

  // Bathroom
  KEY: 'Apartment key',
  PHOEBE_GUITAR: "Phoebe's guitar",
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
  update: function() {
    return false;
  },
  isWithinBounds: function(x, y) {
    return isWithinRectBounds(x, y, this.x, this.y, this.sourceWidth * this.scale, this.sourceHeight * this.scale);
  },
};