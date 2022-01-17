const Colors = {
  WHITE: 'rgba(255,255,255, 1)',
  LIGHT_PURPLE: 'rgba(221, 215, 237, 1)',
  DARK_PURPLE: 'rgba(92, 50, 168, 1)',
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
  LAPTOP: 9,

  MONICAS_ROOM: 10,
  MONICAS_GREEN_DRAWER_1: 11,
  MONICAS_GREEN_DRAWER_2: 12,
  MONICAS_WHITE_DRAWER: 13,
  BIG_BOX: 14,

  GUEST_ROOM: 15,
  GUEST_WHITE_DRAWER_1: 16,
  GUEST_WHITE_DRAWER_2: 17,
  GUEST_WHITE_DRAWER_3: 18,

  BATHROOM: 19,
};

const Names = {
  // Entrance
  CHANDLER_GLASSES: "Chandler's Glasses",
  BABY_DOLL_BROWN: 'Baby Doll Wearing Brown',

  // Kitchen
  MINCED_BEEF: 'Minced Beef',
  RAW_MEATBALLS: 'Raw Meatballs',
  HALF_FRIED_MEATBALLS: 'Half Cooked Meatballs',
  FRIED_MEATBALLS: 'Fried Meatballs',
  MEATBALLS_ON_BREAD: 'Meatballs on Bread',
  MEATBALLS_ON_BREAD_WITH_MARINARA: 'Meatballs on Bread with Marinara Sauce',
  MEATBALLS_ON_BREAD_WITH_MARINARA_CHEESE: 'Meatballs on Bread with Marinara Sauce and Mozarella Cheese',
  MEATBALL_SUB: 'Meatball Sub',
  MOZARELLA_CHEESE: 'Mozarella Cheese',
  FRYING_PAN: 'Frying Pan',
  FIRE: 'Fire',
  HANDYMAN_TOOL: 'Handyman Tool',
  SPICES: 'Spices',
  BREAD_ROLLS: 'Bread Rolls',
  RACHEL_HAT: "Rachel's Hat",

  // Living room items
  TABLE: 'Table',
  CUP: 'Cup',
  EGG: 'Egg',
  BABY_DOLL_WHITE: 'Baby Doll Wearing White',
  MEATBALL_CLAMP: 'Meatball Clamp',
  MARINARA_SAUCE: 'Marinara Sauce',
  CHANDLER_FIGURINE: 'Chandler Bing Figurine',

  // Monica's room items
  RUBBER_BANDS: 'Rubber Bands',
  MIDORI: 'Midori',
  CHOPSTICKS: 'Chopsticks',
  COASTER: 'Coaster',
  GIANT_POKING_DEVICE: 'Giant Poking Device',

  // Guest room items
  THE_SHINING: 'The Shining',
  BREADCRUMBS: 'Breadcrumbs',
  OTTOMAN: 'The Green Ottoman',
  CHOPPED_ONIONS: 'Chopped Onions',
  COOKING_OIL: 'Cooking Oil',
  BABY_DOLL_BLACK: 'Baby Doll Wearing Black',

  // Bathroom
  KEY: 'Apartment Key',
  PHOEBE_GUITAR: "Phoebe's Guitar",
  SAFE_BOX: "Safe Box",
  JELLYFISH_LOTION: 'Jellyfish Protective Lotion',
};

const spriteBase =
{
  img: null,
  INITIAL: 0,
  onClick: function() {
    return false;
  },
  update: function() {
    return false;
  },
};
spriteBase.state = spriteBase.INITIAL;
const spriteObject = {
  ...spriteBase,
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
  [Displays.STORED]: {},
  [Displays.EXAMINED]: {},
  isWithinBounds: function(x, y) {
    return isWithinRectBounds(x, y, this.x, this.y, this.sourceWidth * this.scale, this.sourceHeight * this.scale);
  },
};

// Game rendition constants
const inventory = {
  arrow: {
    width: 40,
    height: 80,
    marginLeft: 19,
    marginRight: 18,
    marginTop: 10,
  },
  slot: {
    width: 80,
    height: 80,
    margin: 10,
  },
  boxX: function(canvasWidth, numberOfItems, i, page) {
    return Math.floor(canvasWidth / 2) - (this.slot.width / 2 * numberOfItems +
      this.slot.margin / 2 * (numberOfItems - 1)) +
      (this.slot.width + this.slot.margin) * (i - (page - 1) * this.perPage);
  },
  numOfItems: function(total, page) {
    return total % (page * this.perPage) < total ?
      this.perPage : total - (page - 1) * this.perPage;
  },
}

const magnifier = {
  margin: 20,
  padding: 20,
  exit: {
    width: 45,
    height: 45,
    margin: 5,
  },
  name: {
    fontSize: 35,
    marginBottom: 25,
  },
  desc: {
    fontSize: 30,
    marginBottom: 5,
  },
  exitX: function(canvasWidth) {
    return canvasWidth - this.margin - this.padding - this.exit.width;
  },
  exitY: function() {
    return this.margin + this.padding;
  }
}

const subtitleBox = {
  exit: {
    width: 30,
    height: 30,
  },
  lineHeight: 10,
  padding: 10,
  fontSize: 25,
  calcHeight: function(lines) {
    return this.padding * 2 + (this.fontSize + this.lineHeight) * lines.length;
  },
}