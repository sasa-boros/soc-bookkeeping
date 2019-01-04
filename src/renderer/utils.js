function numberToSerbianDinars (n) {
  if (!n || isNaN(n) || n.trim() === '') {
    return null
  }
  var nFloored = Math.floor(n)
  var string = nFloored.toString()
  var unitsMale
  var unitsFemale
  var tens
  var hundreds
  var scales
  var start
  var end
  var chunks
  var chunksLen
  var chunk
  var ints
  var i
  var word
  var words

  if (parseInt(string) === 0) {
    return 'нула динара'
  }

  /* Array of units as words */
  unitsMale = ['', 'један', 'два', 'три', 'четири', 'пет', 'шест', 'седам', 'осам', 'девет', 'десет', 'једанаест', 'дванаест', 'тринаест', 'четрнаест', 'петнаест', 'шеснаест', 'седамнаест', 'осамнаест', 'деветнаест']
  unitsFemale = ['', 'једна', 'две', 'три', 'четири', 'пет', 'шест', 'седам', 'осам', 'девет', 'десет', 'једанаест', 'дванаест', 'тринаест', 'четрнаест', 'петнаест', 'шеснаест', 'седамнаест', 'осамнаест', 'деветнаест']

  /* Array of tens as words */
  tens = ['', '', 'двадесет', 'тридесет', 'четрдесет', 'педесет', 'шездесет', 'седамдесет', 'осамдесет', 'деведесет']

  /* Array of tens as words */
  hundreds = ['', 'сто', 'двестa', 'тристa', 'четиристо', 'петсто', 'шестсто', 'седамсто', 'осамсто', 'деветсто']

  /* Array of scales as words */
  scales = ['', 'хиљад', 'милион', 'милијард', 'билион', 'билијард', 'трилион', 'трилијард', 'квадрилион', 'квадрилијард']

  /* Split user arguemnt into 3 digit chunks from right to left */
  start = string.length
  chunks = []
  while (start > 0) {
    end = start
    chunks.push(string.slice((start = Math.max(0, start - 3)), end))
  }

  /* Check if function has enough scale words to be able to stringify the user argument */
  chunksLen = chunks.length
  if (chunksLen > scales.length) {
    return null
  }

  /* Stringify each integer in each chunk */
  words = []
  var femaleScale = false
  for (i = 0; i < chunksLen; i++) {
    chunk = parseInt(chunks[i])
    femaleScale = (i % 2 === 1)
    if (chunk) {
      /* Split chunk into array of individual integers */
      ints = chunks[i].split('').reverse().map(parseFloat)

      /* If tens integer is 1, i.e. 10, then add 10 to units integer */
      if (ints[1] === 1) {
        ints[0] += 10
      }

      /* Add scale word if chunk is not zero and array item exists */
      if ((word = scales[i])) {
        if (femaleScale) {
          /* If scales finishes with 2,3,4
             for example: dve hiljade, tri milijarde, cetiri bilijarde */
          if (ints[0] === 2 || ints[0] === 3 || ints[0] === 4) {
            word += 'е'
          } else {
            /* If scales are thousands or scale finishes with 1
               for example: jedna hiljada, osam hiljada, jedna milijarda */
            if (i === 1 || ints[0] === 1) {
              word += 'а'
            } else {
              /* for example: osam milijardi, sto petnaest bilijardi */
              word += 'и'
            }
          }
        } else {
          /* for example: jedan trilion, dva trilionA, dvadesset trilionA */
          if (ints[0] !== 1) {
            word += 'а'
          }
        }
        words.push(word)
      }

      /* Add unit word if array item exists */
      if (femaleScale) {
        if ((word = unitsFemale[ints[0]])) {
          words.push(word)
        }
      } else {
        if ((word = unitsMale[ints[0]])) {
          words.push(word)
        }
      }

      /* Add tens word if array item exists */
      if ((word = tens[ints[1]])) {
        /* If units of the chunk are between 0 and 9, add an and */
        if (ints[0] > 0 && ints[0] <= 9) {
          words.push('и')
        }
        words.push(word)
      }

      /* Add hundreds word if array item exists */
      if ((word = hundreds[ints[2]])) {
        words.push(word)
      }
    }
  }
  var dinarWord = ' динар'
  if ((nFloored % 10 !== 1) || (nFloored % 100 === 11)) {
    dinarWord += 'а'
  }
  return words.reverse().join(' ') + dinarWord
}

module.exports = {
  numberToSerbianDinars: numberToSerbianDinars
}
