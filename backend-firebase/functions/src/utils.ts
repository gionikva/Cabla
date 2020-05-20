import { JaroWinklerDistance,/*  Spellcheck */ } from "natural";
import { firestore } from "firebase-admin";
//const corpus = require('./wordlist.json');
export interface DefinitionObject {
  text: string;
  sourceDictionary: string;
}
export interface DefinitionValue {
  transitive?: Array<DefinitionObject>;
  intransitive?: Array<DefinitionObject>;
}

export interface WorDefinitionGeneral {
  [propName: string]: Array<DefinitionObject>;
}

export type WordDefinition = WorDefinitionGeneral & {
  verb?: DefinitionValue;
};

export interface Word {
  title: string;
  definition: WordDefinition;
  timeStamp: FirebaseFirestore.Timestamp;
}
type VerbType = "intransitive" | "transitive";
interface VerbDefinitonObject {
  text: string;
  sourceDictionary: string;
  verbType?: VerbType;
}

export function capitalize(str: string, strict: boolean = false) {
  let returnStr = "";
  const words = str.split(" ");
  words.forEach(
    (word, index, array) =>
      (returnStr +=
        word.slice(0, 1).toUpperCase() +
        (strict ? word.slice(1).toLowerCase() : word.slice(1)) +
        (index < array.length - 1 ? " " : ""))
  );

  return returnStr;
}

//Check if the argument is of type DefintionValue
function isDefinitionValue(
  toBeDetermined: Array<DefinitionObject> | DefinitionValue
): toBeDetermined is DefinitionValue {
  if (
    (toBeDetermined as DefinitionValue).transitive ||
    (toBeDetermined as DefinitionValue).intransitive
  ) {
    return true;
  }
  return false;
}

//Modifies Input
function filterSimilarDefinitions(
  array: Array<DefinitionObject | VerbDefinitonObject>
): Array<DefinitionObject | VerbDefinitonObject> {
  let definitionArray: Array<DefinitionObject | VerbDefinitonObject> = [
    ...array,
  ];
  for (let i = 0; i < definitionArray.length; i++) {
    for (let j = i + 1; j < definitionArray.length; j++) {
      if (
        JaroWinklerDistance(
          definitionArray[i].text.toLowerCase(),
          definitionArray[j].text.toLowerCase()
        ) >= 0.6
      ) {
        definitionArray = definitionArray.filter((defintionObject) => {
          if (definitionArray[i].text.length > definitionArray[j].text.length) {
            return (
              defintionObject.text.toLowerCase() !==
              definitionArray[j].text.toLowerCase()
            );
          } else {
            return (
              defintionObject.text.toLowerCase() !==
              definitionArray[i].text.toLowerCase()
            );
          }
        });
        j -= 1;
      }
    }
  }
  return definitionArray;
}

function removeSimilarDefinitions(
  defintionData: Array<DefinitionObject> | DefinitionValue
): Array<DefinitionObject> | DefinitionValue {
  if (!isDefinitionValue(defintionData)) {
    let returnArray: Array<DefinitionObject> = [...defintionData];
    returnArray.sort((defObject1, defObject2) =>
      defObject1.text.length > defObject2.text.length ? -1 : 1
    );
    returnArray = filterSimilarDefinitions(returnArray);
    return returnArray;
  } else {
    let transitives: Array<DefinitionObject> = [];
    let intransitives: Array<DefinitionObject> = [];
    if (defintionData.transitive) {
      transitives = defintionData.transitive;
    }
    if (defintionData.intransitive) {
      intransitives = defintionData.intransitive;
    }

    let allDefs: Array<VerbDefinitonObject> = [
      ...transitives.map((defObject) => {
        let verbType: VerbType = "transitive";
        return {
          text: defObject.text,
          sourceDictionary: defObject.sourceDictionary,
          verbType,
        };
      }),

      ...intransitives.map((defObject) => {
        let verbType: VerbType = "intransitive";
        return {
          text: defObject.text,
          sourceDictionary: defObject.sourceDictionary,
          verbType,
        };
      }),
    ];
    let definitionValue: DefinitionValue = {};
    function toDefinitionObject(object: VerbDefinitonObject): DefinitionObject {
      return {
        text: object.text,
        sourceDictionary: object.sourceDictionary,
      };
    }
    allDefs = filterSimilarDefinitions(allDefs);
    allDefs.forEach((verbDefinitionObject) => {
      if (verbDefinitionObject.verbType == "transitive") {
        if (definitionValue.transitive) {
          definitionValue.transitive.push(
            toDefinitionObject(verbDefinitionObject)
          );
        } else {
          definitionValue.transitive = [
            toDefinitionObject(verbDefinitionObject),
          ];
        }
      } else {
        if (definitionValue.intransitive) {
          definitionValue.intransitive.push(
            toDefinitionObject(verbDefinitionObject)
          );
        } else {
          definitionValue.intransitive = [
            toDefinitionObject(verbDefinitionObject),
          ];
        }
      }
    });
    return definitionValue;
  }
}
export function organize(wordArray: Array<any>, wordData: any) {
  const finalObject: Word = {
    title: wordData.wordTitle,
    definition: {},
    timeStamp: new firestore.Timestamp(
      wordData.timeStamp.seconds,
      wordData.timeStamp.nanoseconds
    ),
  };
  wordArray.forEach((wordObject: any) => {
    if (wordObject.partOfSpeech) {
      let pos: string = wordObject.partOfSpeech;
      let isTransitive: boolean = true;
      if (pos.indexOf("intransitive")) {
        isTransitive = false;
      } else if (wordObject.labels.text === "intransitive") {
        isTransitive = false;
      }

      pos = pos.replace(/(transitive|intransitive|&)/g, "").trim();

      if (wordObject.text) {
        if (finalObject.definition.hasOwnProperty(pos)) {
          if (pos !== "verb") {
            finalObject.definition[pos].push({
              text: wordObject.text,
              sourceDictionary: wordObject.sourceDictionary,
            });
          } else {
            if (finalObject.definition.verb) {
              if (isTransitive) {
                if (finalObject.definition.verb.transitive) {
                  finalObject.definition.verb.transitive.push({
                    text: wordObject.text,
                    sourceDictionary: wordObject.sourceDictionary,
                  });
                } else {
                  finalObject.definition.verb.transitive = [
                    {
                      text: wordObject.text,
                      sourceDictionary: wordObject.sourceDictionary,
                    },
                  ];
                }
              } else {
                if (finalObject.definition.verb.intransitive) {
                  finalObject.definition.verb.intransitive.push({
                    text: wordObject.text,
                    sourceDictionary: wordObject.sourceDictionary,
                  });
                } else {
                  finalObject.definition.verb.intransitive = [
                    {
                      text: wordObject.text,
                      sourceDictionary: wordObject.sourceDictionary,
                    },
                  ];
                }
              }
            }
          }
        } else {
          if (pos !== "verb") {
            finalObject.definition[pos] = [
              {
                text: wordObject.text,
                sourceDictionary: wordObject.sourceDictionary,
              },
            ];
          } else {
            finalObject.definition.verb = {};
            if (isTransitive) {
              finalObject.definition.verb.transitive = [
                {
                  text: wordObject.text,
                  sourceDictionary: wordObject.sourceDictionary,
                },
              ];
            } else {
              finalObject.definition.verb.intransitive = [
                {
                  text: wordObject.text,
                  sourceDictionary: wordObject.sourceDictionary,
                },
              ];
            }
          }
        }
      }
    }
  });

  for (let item of Object.entries(finalObject.definition)) {
    console.log(item);
    if (item[0] == "verb") {
      const filteredValue:
        | Array<DefinitionObject>
        | DefinitionValue = removeSimilarDefinitions(item[1]);
      if (isDefinitionValue(filteredValue)) {
        finalObject.definition.verb = filteredValue;
      }
    } else {
      const filteredValue:
        | Array<DefinitionObject>
        | DefinitionValue = removeSimilarDefinitions(item[1]);
      if (!isDefinitionValue(filteredValue)) {
        finalObject.definition[item[0]] = filteredValue;
      }
    }
  }

  return finalObject;
}
