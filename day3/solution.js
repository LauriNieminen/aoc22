const fs = require('fs')

const { splitRows } = require('../utils')
const { intersection } = require('../utils/set-fns')

const input = splitRows(fs.readFileSync('./input.txt', 'utf-8'))
const test = splitRows(fs.readFileSync('./test.txt', 'utf-8'))

const getPriority = (item) => {
  if (item.toUpperCase() === item) {
    return getPriority(item.toLowerCase()) + 26
  }

  return item.charCodeAt(0) - 96
}

const solveBag = (bag) => {
  const halfWay = Math.floor(bag.length / 2)
  const compartment1 = new Set(bag.slice(0, halfWay).split(''))
  const compartment2 = new Set(bag.slice(halfWay).split(''))

  const overlap = [...compartment2].filter((item) => compartment1.has(item))
  return overlap.reduce((acc, item) => acc + getPriority(item), 0)
}

const findCommon = (bags) => {
  const parsedBags = bags.map((bag) => new Set(bag.split('')))
  const commons = parsedBags.reduce((acc, bag) => intersection(acc, bag), parsedBags[0])
  return [...commons][0]
}

const solveGroups = (bags, groupSize) => {
  const groups = []

  for (let i = 0; i < bags.length; i += groupSize) {
    groups.push(bags.slice(i, i + groupSize))
  }
  return groups.reduce((acc, group) => {
    const common = findCommon(group)
    debugger;
    return getPriority(common) + acc
  }, 0)
}

const testResult = test.map(bag => solveBag(bag)).reduce((acc, item) => acc + item, 0)
const result = input.map(bag => solveBag(bag)).reduce((acc, item) => acc + item, 0)
console.log(result)

const testResult2 = solveGroups(test, 3)
const result2 = solveGroups(input, 3)
console.log(testResult2)
console.log(result2)