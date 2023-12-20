import './shim.js'
// import translate from 'translate-google-api';
import { config } from './config.js'
import { softcoreADI, allDefADI, allProbADI, allMaybeADI } from './ADIs.js'
let ADI = allDefADI.concat(allProbADI);
// import { translate } from '@vitalets/google-translate-api';
import translate from 'google-translate-api-x';
var screenHeight, screenWidth;
const API_URL = config.API_URL;

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
  if (detectedText) {
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
  }
  return detectedText ? [detectedText, wordAndBox] : [{ text: "No text found." }, wordAndBox];
}
async function parseTextManual(text, showMaybeNonVegan, wordAndBox, boxVertices) {
  // let ADI = (isStrict ? allDefADI : softcoreADI);
  let isVegan = true;
  let nonVeganFound = [];

  let maybeVegan = false;
  let maybeVeganFound = [];
  //replaces line breaks with commas, and splits the entire text by "," or ", "
  const wordList = text.replace(/[\n\r\t]/g, ', ').split(/,\s*/);

  //[vegan value from 0 to 2, text]
  let output = [];

  let deleted = [];
  //eliminating certain strings or words
  for (var i = wordList.length - 1; i >= 0; i--) {
    let word = wordList[i];
    //remove periods from end of words
    if (word.endsWith('.')) {
      wordList[i] = word.substring(0, word.length - 1);
    }
    if (!isNaN(word)) {
      deleted.push(word);
      wordList[i] = "";
    }
  }
  //checking if words are vegan
  for (var i = 0; i < wordList.length; i++) {
    let wordsInWord = wordList[i].trim().split(" ");
    for (var j = 0; j < wordsInWord.length; j++) {
      let wordInWord = wordsInWord[j];
      if (ADI.includes(wordInWord)) {
        nonVeganFound.push(wordInWord);
        addToBoxVertices(wordInWord, boxVertices, wordAndBox, "red");
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
        addToBoxVertices(word, boxVertices, wordAndBox, "yellow")
        maybeVegan = true;
      }
      if (/\s/.test(word)) {
        let wordsInWord = word.split(/\s/);
        for (var j = 0; j < wordsInWord.length; j++) {
          let wordInWord = wordsInWord[j];
          if (allMaybeADI.includes(wordInWord)) {
            maybeVeganFound.push(word);
            addToBoxVertices(word, boxVertices, wordAndBox, "yellow");
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
async function fetchDCV(text) {
  try {
    let response = await fetch("https://doublecheckvegan.com/wp-admin/admin-ajax.php", {
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
    console.log("fetched")
    let output = await response.text();
    console.log("texted")
    return output;
  } catch (error) {
    console.log(error)
    return -1;
  }
}
async function parseTextAPI(text, showMaybeNonVegan, wordAndBox, boxVertices) {
  //[vegan value from 0 to 2, foundADI]
  let output = [];
  text = text.replaceAll(/[\n\r\t]/g, ' ').trim();
  text = text.replaceAll("  ", ' ');
  console.log("----------------------text len: " + text.length + " -----------------")
  // console.log(text)
  let isVegan = true;
  let nonVeganFound = "";

  let maybeVegan = false;
  let maybeVeganFound = "";
  let htmlstring = await fetchDCV(text);

  let elementList = htmlstring.split("<");
  for (let i = 0; i < elementList.length; i++) {
    let element = elementList[i];
    if (element.startsWith("label class=\"vegan-status")) {
      let status = element.substring("label class=\"vegan-status".length + 1, element.indexOf("\">"));
      let ingredient = elementList[i + 1].substring("/label>".length);
      // console.log("API ing: " + ingredient)
      if (status == "not-vegan" || status == "probably-not-vegan") {
        isVegan = false;
        nonVeganFound += ingredient + ", ";
        addToBoxVertices(ingredient, boxVertices, wordAndBox, "red");
      } else if (status == "maybe-vegan") {
        maybeVegan = true;
        if (showMaybeNonVegan) addToBoxVertices(ingredient, boxVertices, wordAndBox, "yellow");
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
function addToBoxVertices(ingredient, boxVertices, wordAndBox, boxColor) {
  let vertices = wordAndBox[ingredient.toLowerCase()];
  if (vertices != undefined) {
    let xyPairs = [];   
    //4096 by 2304, scale by height/4096, width/2304
    // vertices.forEach(vertex => xyPairs.push(
    //   [Math.round(vertex.y * screenHeight / 4096),
    //   Math.round(vertex.x * screenWidth / 2304)]));
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
async function parseTextBothWays(text, showMaybeNonVegan, doTranslate, wordAndBox, screenH, sWidth) {
  if (text == "No text found.") return [-1];
  try {
    screenHeight = screenH;
    screenWidth = sWidth;
    // let translated = await translate(text, { to: "en" });
    // let translated = await translate(text, { to: 'en' });
    let languageFound = 'en';
    if (doTranslate) {
      const res = await translate(text, { to: 'en' });
      languageFound = res.from.language.iso;
      if (languageFound != 'en') text = res.text;
    }
    text = text.toLowerCase();
    // console.log(text)
    if (text.includes("may ")) text = text.substring(0, text.indexOf("may "));

    let boxVertices = [];
    const manualWay = await parseTextManual(text, showMaybeNonVegan, wordAndBox, boxVertices);
    var apiWay;
    //set infinite value for apiScore if the text is too long the default should be using the manual check
    let apiScore = Infinity, manualScore = manualWay[0];
    if (text.length < 3000) {
      apiWay = await parseTextAPI(text, showMaybeNonVegan, wordAndBox, boxVertices);
      apiScore = apiWay[0];
    }
    let veganScore = 2;
    let contains = "";
    console.log(apiScore + " " + manualScore)
    if (apiScore == 2 && manualScore == 2) {
      // do nothing
    } else if (apiScore > manualScore) {
      veganScore = manualScore;
      let manualFoundArr = manualWay[1];
      // console.log(manualFoundArr.length + " and " + manualFoundArr)
      for (let manual = 0; manual < manualFoundArr.length; manual++) {
        let ingredient = manualFoundArr[manual].trim();
        //turn the first letter of every word to uppercase
        ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
        // console.log(ingredient)
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
      // console.log("finished (>0)-0")
    } else if (apiScore < manualScore) {
      veganScore = apiScore;
      contains = apiWay[1];
    } else if (apiScore == manualScore) {
      // console.log("in 0-0")
      veganScore = apiScore;
      let apiFoundArr = apiWay[1].split(",");
      // console.log(apiFoundArr)
      let manualFoundArr = manualWay[1];
      // console.log(manualFoundArr)
      for (let api = 0; api < apiFoundArr.length; api++) {
        let f1 = apiFoundArr[api].trim().toLowerCase();
        for (let manual = 0; manual < manualFoundArr.length; manual++) {
          if (manualFoundArr[manual] == "") continue;
          let f2 = manualFoundArr[manual].trim().toLowerCase();
          //apiFound overrides manualFound if they both have the same ingredient
          if (f2 == f1) {
            manualFoundArr[manual] = "";
          }
        }
      }
      // console.log("removed repeats")
      // console.log(apiFoundArr.length + ", " + apiFoundArr)
      for (let api = 0; api < apiFoundArr.length; api++) {
        // console.log("adding " + apiFoundArr[api] + " to " + contains)
        contains += apiFoundArr[api].trim() + ", ";
      }
      // console.log("added APIfound")
      // console.log(manualFoundArr)
      for (let manual = 0; manual < manualFoundArr.length; manual++) {
        if (manualFoundArr[manual] == "") {
          // console.log("skipped " + manual)
          continue;
        }
        // console.log(manualFoundArr[manual].trim())
        let ingredient = manualFoundArr[manual].trim();
        // console.log("before: " + ingredient)
        //turn the first letter of every word to uppercase
        ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
        // console.log("after: " + ingredient)
        let fromIndex = 0;
        while (true) {
          let found = ingredient.indexOf(" ", fromIndex);
          // console.log(found)
          //space not found or at the end
          if (found == -1 || found >= ingredient.length - 1) break;
          ingredient = ingredient.slice(0, found + 1) + ingredient.charAt(found + 1).toUpperCase() + ingredient.slice(found + 2);
          fromIndex = found + 1;
        }
        contains += ingredient.trim() + ", ";
      }
      // console.log("added manual found")
    }
    if (contains.endsWith(", ")) contains = contains.slice(0, contains.length - 2);
    // console.log("sliced contains")
    //remove duplicates
    let containsArr = contains.split(", ");
    let uniqueContainsArr = [];
    containsArr.forEach((ing) => {
      if (!uniqueContainsArr.includes(ing)) {
        uniqueContainsArr.push(ing);
      }
    });
    // console.log("before .join")
    contains = uniqueContainsArr.join(", ");
    // console.log("removed duplicates in contains Arr")

    //adds boxes around ingredients in their original language based on OCR-found coordinates
    if (languageFound != 'en' && contains.length > 0) {
      let translatedADIArr = contains.split(", ");
      let untranslatedADI = await translate(contains, { to: languageFound });
      let untranslatedADIArr = untranslatedADI.text.replaceAll('，', ', ').split(", ");
      let colorOfNonEnglishADIBoxes = (veganScore == 0 ? "red" : "yellow");
      untranslatedADIArr.forEach(ingredient => {
        addToBoxVertices(ingredient, boxVertices, wordAndBox, colorOfNonEnglishADIBoxes);
      });
      for (let ADI = 0; ADI < translatedADIArr.length; ADI++) {
        translatedADIArr[ADI] += " (" + untranslatedADIArr[ADI] + ")";
      }
      contains = translatedADIArr.join(", ");
    }

    //remove duplicate boxes
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
    // console.log("removed duplicates in boxes")

    return [veganScore, contains, boxVertices];
  } catch (error) {
    console.log("" + error)
    return ["error", error];
  }
}
export const OCR = callGoogleVisionAsync;
export const parse = parseTextBothWays;
