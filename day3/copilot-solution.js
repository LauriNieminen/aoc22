// read input.txt and test.txt
// import necessary modules
const fs = require('fs')

const input = fs.readFileSync('input.txt', 'utf8')
const test = fs.readFileSync('test.txt', 'utf8')

// parse input and test into arrays of arrays of characters
// split on newlines, handle carriage returns
const parsedInput = input.split(/\r?\n/).map(row => row.split(''))
const parsedTest = test.split(/\r?\n/).map(row => row.split(''))

// function that maps alphabet to numbers
// a to z is 1 to 26
// A to Z is 27 to 52
const alphabetToNumber = (char) => {
  const charCode = char.charCodeAt(0)
  if (charCode >= 65 && charCode <= 90) {
    return charCode - 38
  }
  return charCode - 96
}

// function that splits an array into two equally long parts
// then finds the one common character and return the character mapped into a number
const findCommonCharacter = (array) => {
  const half = Math.floor(array.length / 2)
  const first = array.slice(0, half)
  const second = array.slice(half)
  const common = first.filter(char => second.includes(char))
  return alphabetToNumber(common[0])
}

// find and score the common character in each row, then print the sum
const score = (array) => {
  const scores = array.map(row => findCommonCharacter(row))
  console.log(scores.reduce((acc, score) => acc + score, 0))
}

// score and print the inputs
score(parsedTest)
score(parsedInput)

// function that groups rows into groups of n
// then finds the common character in each group and returns the sum of the characters mapped into numbers
// do not split the groups in half, just find the common character in each group
const scoreGroups = (array, n) => {
  // split the array into groups of n rows
  const groups = []
  for (let i = 0; i < array.length; i += n) {
    groups.push(array.slice(i, i + n))
  }

  // find the common character in each group of n rows and map it into a number
  // do not use the findCommonCharacter function
  const scores = groups.map(group => {
    // find the common character that is in every row of the group
    const common = group[0].filter(char => group.every(row => row.includes(char)))
    return alphabetToNumber(common[0])
  })

  // return the sum of the scores
  return scores.reduce((acc, score) => acc + score, 0)
}

// score and print the inputs
console.log(scoreGroups(parsedTest, 3))
console.log(scoreGroups(parsedInput, 3))





  
