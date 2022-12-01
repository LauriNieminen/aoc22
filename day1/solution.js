const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8')

const elves = input.split('\n\n')
console.log(elves)
const mappedElves = elves.map(elf => elf.split('\n'))
console.log(mappedElves)
const parsedElves = mappedElves.map(elf => elf.map(row => Number(row)))
console.log(parsedElves)
const sums = parsedElves.map(elf => elf.reduce((a,b) => a + b, 0))
console.log(sums)
const sortedSums = sums.sort((a,b) => b - a)
const max = sortedSums[0] 
console.log(max)

const max3 = sortedSums.slice(0,3).reduce((a,b) => a + b, 0)

console.log(max3)