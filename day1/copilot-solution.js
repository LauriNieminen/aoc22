// read test.txt and input.txt into variabled test and input
const fs = require('fs');
const test = fs.readFileSync('test.txt', 'utf8')
const input = fs.readFileSync('input.txt', 'utf8')

// split delimited by double newlines
const testElves = test.split('\n\n')
const inputElves = input.split('\n\n')

// parse elves into arrays of numbers
const testParsedElves = testElves.map(elf => elf.split('\n').map(row => Number(row)))
const inputParsedElves = inputElves.map(elf => elf.split('\n').map(row => Number(row)))

// sum the elves
const testSums = testParsedElves.map(elf => elf.reduce((a,b) => a + b, 0))
const inputSums = inputParsedElves.map(elf => elf.reduce((a,b) => a + b, 0))

// find the largest sum
const testMax = testSums.sort((a,b) => b - a)[0]
const inputMax = inputSums.sort((a,b) => b - a)[0]

// find the sum of the three largest sums
const testMax3 = testSums.slice(0,3).reduce((a,b) => a + b, 0)
const inputMax3 = inputSums.slice(0,3).reduce((a,b) => a + b, 0)

// print the results
console.log('testMax', testMax)
console.log('inputMax', inputMax)
console.log('testMax3', testMax3)
console.log('inputMax3', inputMax3)
