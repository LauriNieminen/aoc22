const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8')
const test = fs.readFileSync('test.txt', 'utf8')

const parsedInput = input.split('\n').map(row => row.split(' ').map(shape => shape.trim()))
const parsedTest = test.split('\n').map(row => row.split(' ').map(shape => shape.trim()))

const parsedTest2 = [
['A', 'X'], // 3 + 1 = 4
['A', 'Y'], // 6 + 2 = 8
['A', 'Z'], // 0 + 3 = 3
['B', 'X'], // 0 + 1 = 1
['B', 'Y'], // 3 + 2 = 5
['B', 'Z'], // 6 + 3 = 9
['C', 'X'], // 6 + 1 = 7 
['C', 'Y'], // 0 + 2 = 2
['C', 'Z'], // 3 + 3 = 6
] // sum = 45

const shapeScores = {
  'A': 1,
  'B': 2,
  'C': 3,
  'X': 1,
  'Y': 2,
  'Z': 3,
}

const shapeMatches = {
  'A': 'X',
  'B': 'Y',
  'C': 'Z'
}

const winningMap = {
  'A': 'Y',
  'B': 'Z',
  'C': 'X'
}

const losingMap = {
  'A': 'Z',
  'B': 'X',
  'C': 'Y'
}

const score = (otherShape, myShape) => {
  const mappedOther = shapeMatches[otherShape]
  if (myShape === mappedOther) {
    return shapeScores[myShape] + 3
  }
  if (myShape === 'Z' && otherShape === 'A') {
    return shapeScores[myShape]
  }
  if (myShape === 'X' && otherShape === 'C') {
    return shapeScores[myShape] + 6
  }
  if (shapeScores[myShape] > shapeScores[otherShape]) {
    return shapeScores[myShape] + 6
  }
  return shapeScores[myShape]
}

const choose = (otherShape, myShape) => {
  if (myShape === 'Z') {
    return [otherShape, winningMap[otherShape]]
  }

  if (myShape === 'Y') {
    return [otherShape, shapeMatches[otherShape]]
  }

  if (myShape === 'X') {
    return [otherShape, losingMap[otherShape]]
  }
}

const testScore = parsedTest.reduce((acc, shapes) => acc + score(shapes[0], shapes[1]), 0)
console.log('testScore', testScore)

const inputScore = parsedInput.reduce((acc, shapes) => acc + score(shapes[0], shapes[1]), 0)
console.log('inputScore', inputScore)

const testChoose = parsedTest.map(row => choose(row[0], row[1])).reduce((acc, shapes) => acc + score(shapes[0], shapes[1]), 0)
console.log('testChoose', testChoose)

const inputChoose = parsedInput.map(row => choose(row[0], row[1])).reduce((acc, shapes) => acc + score(shapes[0], shapes[1]), 0)
console.log('inputChoose', inputChoose)