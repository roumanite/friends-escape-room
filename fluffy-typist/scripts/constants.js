const Types = {
  TEXT: '0',
  IMAGE: '1',
  RECTANGULAR: '2',
  TEXT_STROKE: '3',
  WORD_SPAWN: '4',
};

const spriteBase = {
  type: Types.IMAGE,
  visible: true,
  alpha: 1,
  delta: 0,
};

const artBase =
{
  ...spriteBase,
  img: null,
  INITIAL: 0,
};
artBase.state = artBase.INITIAL;
artBase[artBase.INITIAL] = {
  alpha: 1,
  delta: 0,
  x: 0,
  y: 0,
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 0,
  sourceHeight: 0,
  scale: 1,
  rotation: 0,
  repeatX: 1,
  repeatY: 1,
};

const textBase = {
  ...spriteBase,
  type: Types.TEXT,
  font: '',
  baseline: 'top',
  shadowColor: 'black',
  shadowBlur: 0,
  x: 0,
  y: 0,
}

const rectBase = {
  ...spriteBase,
  type: Types.RECTANGULAR,
  width: 100,
  height: 100,
  x: 0,
  y: 0,
}

const stateBase = {
  sprites: [],
  appendSprites: false,
  update: () => {},
  listeners: {},
}

const selectionGenerator = {
  words: [],
  randomize: function(categories) {
    const result = new Set();
    let totalCount = 0;
    let count = 0;
    let jobNotDone = true;
    categories.forEach((category, i) => {
      totalCount += category.count;
    });
    const positions = new Array(totalCount).fill({});
    const resultCount = new Array(categories.length).fill(0);
    
    while(jobNotDone) {
      let wordInvalid = true;
      let positionInvalid = true;
      let word = '', position = 0;
      while(wordInvalid || positionInvalid) {
        word = words[Math.floor(Math.random() * words.length)]
        position = Math.floor(Math.random() * totalCount);
        wordInvalid = result.has(word);
        positionInvalid = Object.keys(positions[position]).length > 0;
      }
      
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        
        if (resultCount[i] < category.count && !result.has(word) && category.isCriteriaFulfilled(word)) {
          result.add(word);
          positions[position] = { word: word, categoryIndex: i };
          count++;
          resultCount[i]++;
          break;
        }
      }
      if (count === totalCount) {
        jobNotDone = false;
      }
    };
    return positions;
  }
};