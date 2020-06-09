export function capitalize(str, strict=false) {
    let returnStr = "";
    const words = str.split(" ");
      words.forEach(
        (word, index, array) => (returnStr += word.slice(0,1).toUpperCase() + (strict ? word.slice(1).toLowerCase() :word.slice(1))  + ((index < array.length-1) ? " " : ''))
      );
   
    return returnStr;
}
export function toArray(definitionData){
  if (definitionData.transitive && definitionData.intransitive) {
    return [...definitionData.transitive, ...definitionData.intransitive];
  } else if (definitionData.transitive) {
    return definitionData.transitive;
  } else if (definitionData.intransitive) {
    return definitionData.intransitive;
  } else {
    return definitionData;
  }
}

export function trimSlash(str) {
  return str.replace(/^\/+|\/+$/g, "");
}

export const onMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);

