export function capitalize(str, strict=false) {
    let returnStr = "";
    const words = str.split(" ");
      words.forEach(
        (word, index, array) => (returnStr += word.slice(0,1).toUpperCase() + (strict ? word.slice(1).toLowerCase() :word.slice(1))  + ((index < array.length-1) ? " " : ''))
      );
   
    return returnStr;
}



export const onMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);

