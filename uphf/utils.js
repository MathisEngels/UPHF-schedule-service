const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));

function capitalizeTheFirstLetterOfEachWord(words) {
   let separateWord = words.toLowerCase().split(' ');
   for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
      separateWord[i].substring(1);
   }
   return separateWord.join(' '); 
}

function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}


module.exports = { sleep, capitalizeTheFirstLetterOfEachWord, capitalizeFirstLetter };