const stringFunctions = {
  camelCase: [],
  capitalize: [],
  concatString: [{param2: 'concat'}],
  deburr: [],
  endsWith: [{param2: 'target'}, {param3: 'position'}],
  escape: [],
  escapeRegExp: [],
  kebabCase: [],
  lowerCase: [],
  lowerFirst: [],
  pad: [{param2: 'length'}, {param3: 'chars'}],
  padEnd: [{param2: 'length'}, {param3: 'chars'}],
  padStart: [{param2: 'length'}, {param3: 'chars'}],
  parseInt: [{param2: 'radix'}],
  repeat: [{param2: 'n'}],
  replace: [{param2: 'pattern'}, {param3: "replacement"}],
  scrollText: [{param2: 'places'}],
  snakeCase: [],
  split: [{param2: 'separator'}, {param3: 'limit'}],
  startCase: [],
  startsWith: [{param2: 'target'}, {param3: 'position'}],
  substring: [{param2: 'start'}, {param3: 'end'}],
  toLower: [],
  toUpper: [],
  trim: [{param2: 'chars'}],
  trimEnd: [{param2: 'chars'}],
  trimStart: [{param2: 'chars'}],
  unescape: [],
  upperCase: [],
  upperFirst: [],
  words: [{param2: 'pattern'}]
};

function addCustomFunctions(_){
  _.substring = function(str, start, end){
    start = Number(start);
    end = Number(end);
    str = String(str);
    if(end >= 0){
      return str.substring(start, end);
    }
    return str.substring(start);
  }

  _.concatString = function(stra, strb){
    stra = String(stra);
    strb = String(strb);
    return stra + strb;
  }

  _.scrollText = function(str, places){
    str = String(str);
    places = parseInt(Number(places), 10);
    if(!places){
      return str;
    }

    if(places < 0){
      places= Math.abs(places);
      return str.substring(str.length - places) +  str.substring(0, str.length - places);
    }

    return str.substring(places) + str.substring(0, places);

    return str;
  }
}

module.exports = {stringFunctions, addCustomFunctions};
