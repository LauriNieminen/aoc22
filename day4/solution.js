const fs = require('fs')
const { splitRows } = require('../utils')

const input = splitRows(fs.readFileSync('input.txt', 'utf8'))
const test = splitRows(fs.readFileSync('test.txt', 'utf8'))

const parseRows = (rows) => rows.map(row => row.split(',').map(part => {
  const ends = part.split('-')
  return {
    start: parseInt(ends[0]),
    end: parseInt(ends[1])
  }
}
))

const parsedInput = parseRows(input)
const parsedTest = parseRows(test)

const contains = (interval1, interval2) => (interval1.start >= interval2.start && interval1.start <= interval2.end
  && interval1.end >= interval2.start && interval1.end <= interval2.end)
  || (interval1.start <= interval2.start && interval1.start <= interval2.end
    && interval1.end >= interval2.start && interval1.end >= interval2.end)

const overlaps = (interval1, interval2) => (interval1.start >= interval2.start && interval1.start <= interval2.end)
  || (interval1.end >= interval2.start && interval1.end <= interval2.end)
  || (interval1.start <= interval2.start && interval1.end >= interval2.start)
  || (interval1.end >= interval2.start && interval1.start <= interval2.end)

const testResult = parsedTest.filter(row => {
  const [a, b] = row
  const ret = contains(a, b)
  debugger;
  return ret
}).length

const result = parsedInput.filter(row => {
  const [a, b] = row
  return contains(a, b)
}).length

console.log('testResult', testResult)
console.log('result', result)

const testResult2 = parsedTest.filter(row => {
  const [a, b] = row
  return overlaps(a, b)
}).length

const result2 = parsedInput.filter(row => {
  const [a, b] = row
  return overlaps(a, b)
}).length

console.log('testResult2', testResult2)
console.log('result2', result2)


