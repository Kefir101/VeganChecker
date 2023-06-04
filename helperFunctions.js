import './shim.js'
import './config.js'
import translate from 'translate-google-api';

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
  return detectedText ? detectedText : { text: "No text found." };
}
async function parseTextManual(text, showMaybeNonVegan) {
  // let ADI = (isStrict ? allDefADI : softcoreADI);
  let ADI = allDefADI.concat(allProbADI);
  let isVegan = true;
  let nonVeganFound = [];

  let maybeVegan = false;
  let maybeVeganFound = [];
  let translated = await translate(text, {to: "en"});
  text = translated[0];
  console.log(text)
  //replaces line breaks with commas, and splits the entire text by "," or ", "
  const wordList = text.toLowerCase().replace(/[\n\r]/g, ', ').split(/,\s*/);
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
    let word = wordList[i];
    if (ADI.includes(word)) {
      nonVeganFound.push(word);
      isVegan = false;
    }
    if (/\s/.test(word)) {
      let wordsInWord = word.split(/\s/);
      for (var j = 0; j < wordsInWord.length; j++) {
        let wordInWord = wordsInWord[j];
        if (ADI.includes(wordInWord)) {
          nonVeganFound.push(word);
          isVegan = false;
        }
      }
    }
  }
  //checking ingredients that may not be vegan
  if (showMaybeNonVegan) {
    for (var i = 0; i < wordList.length; i++) {
      let word = wordList[i];
      if (allMaybeADI.includes(word)) {
        maybeVeganFound.push(word);
        maybeVegan = true;
      }
      if (/\s/.test(word)) {
        let wordsInWord = word.split(/\s/);
        for (var j = 0; j < wordsInWord.length; j++) {
          let wordInWord = wordsInWord[j];
          if (allMaybeADI.includes(wordInWord)) {
            maybeVeganFound.push(word);
            maybeVegan = true;
          }
        }
      }
    }
  }
  if (isVegan && !maybeVegan) {
    output[0] = 2;
  } else {
    output = [0, "Contains: " + nonVeganFound]
  }
  if (maybeVegan && isVegan) {
    output = [1, maybeVeganFound]
  }
  return output;
}
async function parseTextAPI(text, showMaybeNonVegan){
  //[vegan value from 0 to 2, foundADI]
  let output = [];
  // console.log(text + "\n__________________________________________________________________________")
  if (text == "No text found.") {
    output[0] = -1;
    return output;
  }
  let translated = await translate(text, {to: "en"});
  text = translated[0].toLowerCase();
  if(text.includes("may ")){
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
  for(let i = 0; i < elementList.length; i++){
    let element = elementList[i];
    if(element.startsWith("label class=\"vegan-status")){
      let status = element.substring("label class=\"vegan-status".length+1, element.indexOf("\">"));
      let ingredient = elementList[i+1].substring("/label>".length);
      if(status == "not-vegan" || status == "probably-not-vegan"){
        isVegan = false;
        nonVeganFound += ingredient + ", ";
      } else if(status == "maybe-vegan"){
        maybeVegan = true;
        maybeVeganFound += ingredient + ", ";
      }
    }
  }
  if (isVegan && (!maybeVegan || !showMaybeNonVegan)) {
    output[0] = 2;
  } else if(!isVegan) {
    output = [0, "Contains: " + nonVeganFound.substring(0, nonVeganFound.length-2)];
  }
  if (maybeVegan && isVegan && showMaybeNonVegan) {
    output = [1, maybeVeganFound.substring(0, maybeVeganFound.length-2)];
  }
  return output;
}
export const OCR = callGoogleVisionAsync;
export const parse = parseTextAPI;
