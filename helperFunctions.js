import './shim.js'
import translate from 'translate-google-api';
import { config } from './config.js'
const API_URL = config.API_URL;
const softcoreADI = ['animal fat',
  'animal fats and oils',
  'animal fiber',
  'animal hair',
  'antlers',
  'bear bile',
  'bee pollen',
  'beeswax',
  'blood',
  'bone ash',
  'bone char',
  'bone meal',
  'broth',
  'carmine',
  'carotene',
  'casein',
  'caseinate',
  'cashmere',
  'castor',
  'castoreum',
  'caviar',
  'cheese',
  'cochineal',
  'confectioner\'s glaze',
  'cricket flour',
  'custard',
  'down',
  'egg',
  'eggnog',
  'eggs',
  'escargot',
  'feathers',
  'fish',
  'fishmeal',
  'fur',
  'gallstones',
  'game',
  'gelatin',
  'ghee',
  'honey',
  'honeycomb',
  'horns',
  'horse oil',
  'horsehair',
  'insects',
  'ivory',
  'lactose',
  'lard',
  'lardon',
  'leather',
  'livestock',
  'manure',
  'mayonnaise',
  'meat',
  'milk',
  'mink',
  'mink lashes',
  'mink oil',
  'musk',
  'nautilus',
  'offal',
  'organ',
  'organs',
  'pearl',
  'quarry',
  'rennet',
  'royal jelly',
  'scales',
  'shark',
  'shellac',
  'shellfish',
  'silk',
  'skin',
  'skins',
  'skunk oil',
  'snail',
  'snails',
  'snake wine',
  'sponge',
  'stock',
  'suede',
  'tallow',
  'tortoise shell',
  'tortoiseshell',
  'venom',
  'whale oil',
  'whey',
  'wool'
];
const allDefADI = [
  'afterbirth',
  'albumen',
  'albumin',
  'alligator skin',
  'ambergris',
  'amerchol l101',
  'angora',
  'animal bone ash',
  'animal fat',
  'animal fats and oils',
  'animal fiber',
  'animal hair',
  'antlers',
  'arachnids',
  'bear bile',
  'bee pollen',
  'bee products',
  'beeswax',
  'blood',
  'boar bristles',
  'bone',
  'bone ash',
  'bone char',
  'bone meal',
  'calcium caseinate',
  'calfskin',
  'carmine',
  'carminic acid',
  'casein',
  'caseinate',
  'cashmere',
  'castor',
  'castoreum',
  'catgut',
  'caviar',
  'cera flava',
  'cheese',
  'cochineal',
  'cod liver oil',
  'collagen',
  "confectioner's glaze",
  'cricket flour',
  'donkey milk',
  'down',
  'egg',
  'egg protein',
  'eggnog',
  'eggs',
  'ejaculate',
  'elastin',
  'emu oil',
  'escargot',
  'feathers',
  'fish',
  'fish liver oil',
  'fish oil',
  'fish scales',
  'fishmeal',
  'fur',
  'game',
  'gelatin',
  'ghee',
  'hard roe',
  'hide glue',
  'honey',
  'honeycomb',
  'horns',
  'horse oil',
  'horsehair',
  'hydrolyzed animal protein',
  'hydrolyzed milk protein',
  'insects',
  'isinglass',
  'isopropyl lanolate',
  'lactose',
  'laneth',
  'lanogene',
  'lanolin',
  'lanolin acids',
  'lanolin alcohol',
  'lard',
  'leather',
  'manure',
  'marine oil',
  'meat',
  'milk',
  'milk protein',
  'mink',
  'mink lashes',
  'mink oil',
  'offal',
  'organ',
  'organs',
  'pearl',
  'pearl essence',
  'pepsin',
  'placenta',
  'propolis',
  'quarry',
  'rennet',
  'rennin',
  'resinous glaze',
  'royal jelly',
  'scales',
  'schmaltz',
  'sea turtle oil',
  'shark',
  'shark liver oil',
  'shellac',
  'shellfish',
  'silk',
  'silk powder',
  'skin',
  'skins',
  'skunk oil',
  'snail',
  'snails',
  'snake wine',
  'sodium caseinate',
  'sodium tallowate',
  'soft roe',
  'sperm oil',
  'sponge',
  'suet',
  'tallow',
  'tallow acid',
  'tallow amide',
  'tallow amine',
  'tallow fatty alcohol',
  'tallow glycerides',
  'tallow imidazoline',
  'talloweth-6',
  'urea',
  'uric acid',
  'urine',
  'venom',
  'whale oil',
  'whey',
  'wool',
  'wool fat',
  'wool wax'
];
const allProbADI = [
  'chitosan',
  'cholesterol',
  'cholesterin',
  'duodenum substance',
  'duodenum substances',
  'estradiol',
  'guanine',
  'polypeptides',
  'pristane',
  'lanosterols',
  'keratin',
  'methionine',
  'vitamin d3',
];
const allMaybeADI = [
  'adrenaline',
  'alanine',
  'alcloxa',
  'aldioxa',
  'aliphatic alcohol',
  'allantoin',
  'alpha-hydroxy acids',
  'ambrosia',
  'amino acids',
  'aminosuccinate acid',
  'arachidonic acid',
  'arachidyl proprionate',
  'beta carotene',
  'biotin',
  'broth',
  'calciferol',
  'capryl betaine',
  'caprylamine oxide',
  'caprylic acid',
  'caprylic triglyceride',
  'carbamide',
  'carotene',
  'cerebrosides',
  'cetyl alcohol',
  'cetyl palmitate',
  'choline bitartrate',
  'civet',
  'civet oil',
  'coral rock',
  'corticosteroid',
  'cortisone',
  'custard',
  'cysteine',
  'l-form',
  'cystine',
  'dexpanthenol',
  'diglycerides',
  'dimethyl stearamine',
  'dyes',
  'ergocalciferol',
  'ergosterol',
  'estrogen',
  'gallstones',
  'glucose tyrosinase',
  'glycerides',
  'glycerin',
  'glycerol',
  'glyceryls',
  'glycreth-26',
  'gribenes',
  'guano',
  'hyaluronic acid',
  'hydrocortisone',
  'imidazolidinyl urea',
  'insulin',
  'isopropyl myristate',
  'isopropyl palmitate',
  'ivory',
  'l. cysteine',
  'lactic acid',
  'lardon',
  'lecithin',
  'linoleic acid',
  'linoleic acids',
  'lipase',
  'lipids',
  'lipoids',
  'livestock',
  'mayonnaise',
  'monoglycerides',
  'musk',
  'myristal ether sulfate',
  'myristic acid',
  'myristyls',
  'natural glaze',
  'nautilus',
  'nucleic acids',
  'ocenol',
  'octyl dodecanol',
  'oleic acid',
  'oleths',
  'oleyl alcohol',
  'oleyl arachidate',
  'oleyl imidazoline',
  'oleyl myristate',
  'oleyl oleate',
  'oleyl stearate',
  'palmitamide',
  'palmitamine',
  'palmitate',
  'palmitic acid',
  'panthenol',
  'panthenyl',
  'polyglycerol',
  'polysorbates',
  'progesterone',
  'provitamin a',
  'provitamin b-5',
  'provitamin d-2',
  'provitamin d2',
  'pure food glaze',
  'rambak',
  'retinol',
  'ribonucleic acid',
  'rinds',
  'rna',
  'sable brushes',
  'scratchings',
  'sea shells',
  'sheepskin',
  'sodium steroyl lactylate',
  'spermaceti',
  'squalane',
  'squalene',
  'stearamide',
  'stearamine',
  'stearamine oxide',
  'stearates',
  'stearic acid',
  'stearic hydrazide',
  'stearin',
  'stearone',
  'stearoxytrimethylsilane',
  'stearoyl lactylic acid',
  'stearyl acetate',
  'stearyl alcohol',
  'stearyl betaine',
  'stearyl caprylate',
  'stearyl citrate',
  'stearyl glycyrrhetinate',
  'stearyl heptanoate',
  'stearyl imidazoline',
  'stearyl octanoate',
  'stearyl stearate',
  'stearyldimethyl amine',
  'steroids',
  'sterols',
  'stock',
  'suede',
  'tortoise shell',
  'tortoiseshell',
  'triterpene alcohols',
  'turtle oil',
  'tyrosine',
  'vitamin a',
  'vitamin b factor',
  'vitamin b-complex factor',
  'vitamin b12',
  'vitamin d',
  'vitamin d2',
  'vitamin h',
];

function generateBody(image) {
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: "TEXT_DETECTION",
            maxResults: 1,
          },
        ],
      },
    ],
  };
  return body;
}
async function callGoogleVisionAsync(image) {
  const body = generateBody(image);
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  const detectedText = result.responses[0].fullTextAnnotation;
  const wordAndBox = {};

  detectedText.pages.forEach(page => {
    page.blocks.forEach(block => {
      block.paragraphs.forEach(paragraph => {
        paragraph.words.forEach(word => {
          const wordText = word.symbols.map(s => s.text).join('');
          wordAndBox[wordText.toLowerCase()] = word.boundingBox.vertices;
        });
      });
    });
  });
  return detectedText ? [detectedText, wordAndBox] : [{ text: "No text found." }, wordAndBox];
}
function parseTextManual(text, showMaybeNonVegan, wordAndBox, boxVertices, screenHeight, screenWidth) {
  // let ADI = (isStrict ? allDefADI : softcoreADI);
  let ADI = allDefADI.concat(allProbADI);
  let isVegan = true;
  let nonVeganFound = [];

  let maybeVegan = false;
  let maybeVeganFound = [];
  //replaces line breaks with commas, and splits the entire text by "," or ", "
  const wordList = text.toLowerCase().replace(/[\n\r\t]/g, ', ').split(/,\s*/);
  const fillerWords = ["the", "in", "a", "and", "with"];

  //[vegan value from 0 to 2, text]
  let output = [];

  if (wordList[0] == "no text found.") {
    output = [-1, "No words found. Please scan again."]
    return output;
  }
  let deleted = [];
  //eliminating certain strings or words
  for (var i = wordList.length - 1; i >= 0; i--) {
    let word = wordList[i];
    //remove periods from end of words
    if (word.endsWith('.')) {
      wordList[i] = word.substring(0, word.length - 1);
    }
    //remove all words that are numbers
    if (!isNaN(word)) {
      deleted.push(word);
      wordList.splice(i, 1);
    }
    if (fillerWords.includes(word)) {
      deleted.push(word);
      wordList.splice(i, 1);
    }
    //removes the allergen list (may contain...)
    if (word.includes("may")) {
      wordList.splice(i, Infinity);
    }
  }
  //checking if words are vegan
  for (var i = 0; i < wordList.length; i++) {
    let wordsInWord = wordList[i].trim().split(" ");
    for (var j = 0; j < wordsInWord.length; j++) {
      let wordInWord = wordsInWord[j];
      if (ADI.includes(wordInWord)) {
        nonVeganFound.push(wordInWord);
        addToBoxVertices(wordInWord, boxVertices, wordAndBox, "red", screenHeight, screenWidth);
        isVegan = false;
      }
    }
  }
  //checking ingredients that may not be vegan
  if (showMaybeNonVegan) {
    for (var i = 0; i < wordList.length; i++) {
      let word = wordList[i];
      if (allMaybeADI.includes(word)) {
        maybeVeganFound.push(word);
        addToBoxVertices(word, boxVertices, wordAndBox, "yellow", screenHeight, screenWidth)
        maybeVegan = true;
      }
      if (/\s/.test(word)) {
        let wordsInWord = word.split(/\s/);
        for (var j = 0; j < wordsInWord.length; j++) {
          let wordInWord = wordsInWord[j];
          if (allMaybeADI.includes(wordInWord)) {
            maybeVeganFound.push(word);
            addToBoxVertices(word, boxVertices, wordAndBox, "yellow", screenHeight, screenWidth);
            maybeVegan = true;
          }
        }
      }
    }
  }
  if (isVegan && !maybeVegan) {
    output = [2, ""];
  } else {
    output = [0, nonVeganFound]
  }
  if (maybeVegan && isVegan) {
    output = [1, maybeVeganFound]
  }
  return output;
}
async function parseTextAPI(text, showMaybeNonVegan, wordAndBox, boxVertices, screenHeight, screenWidth) {
  //[vegan value from 0 to 2, foundADI]
  let output = [];
  // console.log(text + "\n__________________________________________________________________________")
  if (text == "No text found.") {
    output[0] = -1;
    return output;
  }
  if (text.includes("may ")) {
    text = text.substring(0, text.indexOf("may "))
  }
  let isVegan = true;
  let nonVeganFound = "";

  let maybeVegan = false;
  let maybeVeganFound = "";
  const response = await fetch("https://doublecheckvegan.com/wp-admin/admin-ajax.php", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": `action=search_ingredients&data=${text}`,
    "method": "POST"
  });
  let htmlstring = await response.text();
  let elementList = htmlstring.split("<");
  console.log(isVegan + ", " + showMaybeNonVegan);
  for (let i = 0; i < elementList.length; i++) {
    let element = elementList[i];
    if (element.startsWith("label class=\"vegan-status")) {
      let status = element.substring("label class=\"vegan-status".length + 1, element.indexOf("\">"));
      let ingredient = elementList[i + 1].substring("/label>".length);
      if (status == "not-vegan" || status == "probably-not-vegan") {
        isVegan = false;
        nonVeganFound += ingredient + ", ";
        addToBoxVertices(ingredient, boxVertices, wordAndBox, "red", screenHeight, screenWidth);
      } else if (status == "maybe-vegan") {
        maybeVegan = true;
        if (showMaybeNonVegan) addToBoxVertices(ingredient, boxVertices, wordAndBox, "yellow", screenHeight, screenWidth);
        maybeVeganFound += ingredient + ", ";
      }
    }
  }
  if (isVegan && (!maybeVegan || !showMaybeNonVegan)) {
    output = [2, ""];
  } else if (!isVegan) {
    output = [0, nonVeganFound.substring(0, nonVeganFound.length - 2)];
  }
  if (maybeVegan && isVegan && showMaybeNonVegan) {
    output = [1, maybeVeganFound.substring(0, maybeVeganFound.length - 2)];
  }
  return output;
}
function addToBoxVertices(ingredient, boxVertices, wordAndBox, boxColor, screenHeight, screenWidth) {
  let vertices = wordAndBox[ingredient.toLowerCase()];
  if (vertices != undefined) {
    let xyPairs = [];
    //4096 by 2304, scale by height/4096, width/2304
    vertices.forEach(vertex => xyPairs.push(
      [Math.round(vertex.y * screenHeight / 4096), 
    Math.round(vertex.x * screenWidth / 2304)]));
    for (let other = 0; other < boxVertices.length; other++) {
      const otherBox = boxVertices[other];
      if (otherBox[0][0][0] == xyPairs[0][0] && otherBox[0][0][1] == xyPairs[0][1]) return;
    }
    boxVertices.push([xyPairs, boxColor]);
  }
}
async function parseTextBothWays(text, showMaybeNonVegan, wordAndBox, screenHeight, screenWidth) {
  let translated = await translate(text, { to: "en" });
  text = translated[0];
  let boxVertices = [];

  const apiWay = await parseTextAPI(text, showMaybeNonVegan, wordAndBox, boxVertices, screenHeight, screenWidth);
  const manualWay = parseTextManual(text, showMaybeNonVegan, wordAndBox, boxVertices, screenHeight, screenWidth);
  let apiScore = apiWay[0], manualScore = manualWay[0];
  console.log(apiScore + ", " + manualScore);
  console.log("A:" + apiWay[1]);
  console.log("M: " + manualWay[1]);
  let veganScore = Math.min(apiScore, manualScore);
  let contains = "";
  if (apiScore == 2 && manualScore == 2) {
    // do nothing
  } else if (apiScore > manualScore) {
    let manualFoundArr = manualWay[1];
    for (let manual = 0; manual < manualFoundArr.length; manual++) {
      let ingredient = manualFoundArr[manual].trim();
      //turn the first letter of every word to uppercase
      ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
      let fromIndex = 0;
      while (true) {
        let found = ingredient.indexOf(" ", fromIndex);
        //space not found or at the end
        if (found == -1 || found >= ingredient.length - 1) break;
        ingredient = ingredient.slice(0, found + 1) + ingredient.charAt(found + 1).toUpperCase() + ingredient.slice(found + 2);
        fromIndex = found + 1;
      }
      contains += ingredient.trim() + ", ";
    }
  } else if (apiScore < manualScore) {
    contains = apiWay[1];
  } else if (apiScore == manualScore) {
    let apiFoundArr = apiWay[1].split(",");
    let manualFoundArr = manualWay[1];
    for (let api = 0; api < apiFoundArr.length; api++) {
      let f1 = apiFoundArr[api];
      for (let manual = 0; manual < manualFoundArr.length; manual++) {
        let f2 = manualFoundArr[manual];
        //apiFound overrides manualFound if they both have the same ingredient
        if (f2.trim().toLowerCase() == f1.trim().toLowerCase()) {
          manualFoundArr[manual] = "";
        }
      }
    }
    for (let api = 0; api < apiFoundArr.length; api++) {
      contains += apiFoundArr[api].trim() + ", ";
    }
    console.log(manualFoundArr)
    for (let manual = 0; manual < manualFoundArr.length; manual++) {
      if (manualFoundArr[manual] == "") continue;
      let ingredient = manualFoundArr[manual].trim();
      //turn the first letter of every word to uppercase
      ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
      let fromIndex = 0;
      while (true) {
        let found = ingredient.indexOf(" ", fromIndex);
        //space not found or at the end
        if (found == -1 || found >= ingredient.length - 1) break;
        ingredient = ingredient.slice(0, found + 1) + ingredient.charAt(found + 1).toUpperCase() + ingredient.slice(found + 2);
        fromIndex = found + 1;
      }
      contains += ingredient.trim() + ", ";
    }
  }
  if (contains.endsWith(", ")) {
    contains = contains.slice(0, contains.length - 2);
  }
  for (let b1i = 0; b1i < boxVertices.length; b1i++) {
    const b1 = boxVertices[b1i];
    for (let b2i = b1i + 1; b2i < boxVertices.length; b2i++) {
      const b2 = boxVertices[b2i];
      let same = true;
      for (let corner = 0; corner < 4; corner++) {
        let b1c = b1[0][corner], b2c = b2[0][corner];
        if (b1c[0] != b2c[0] || b1c[1] != b2c[1]) {
          same = false;
          break;
        }
      }
      if (same) console.log("Duplicate box found: " + b1);
    }
  }
  console.log(boxVertices.length)
  return [veganScore, contains, boxVertices];
}
export const OCR = callGoogleVisionAsync;
export const parse = parseTextBothWays;
