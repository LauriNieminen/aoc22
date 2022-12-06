const fs = require('fs')

const input = fs.readFileSync('input.txt', 'utf8');
const test = fs.readFileSync('test.txt', 'utf8');

type Signal = string

const parsedInput: Signal = input.trim()
const parsedTest: Signal[] = test.split(/\r?\n/).map((signalData: string) => signalData.trim())

const findFirstMarker = (signal: Signal): number => {
  let candidate = signal.slice(0,4)
  let rest = signal.slice(4)
  let index = 3
  debugger;
  while ((new Set(candidate)).size !== 4 && rest.length > 0) {
    candidate = candidate.slice(1)
    candidate = candidate + rest[0]
    rest = rest.slice(1)
    index++
  }

  return index + 1
}

const findMessageMarker = (signal: Signal): number => {
  let candidate = signal.slice(0,14)
  let rest = signal.slice(14)
  let index = 13
  debugger;
  while ((new Set(candidate)).size !== 14 && rest.length > 0) {
    candidate = candidate.slice(1)
    candidate = candidate + rest[0]
    rest = rest.slice(1)
    index++
  }

  return index + 1
}

const testMarkers = parsedTest.map(signal => findFirstMarker(signal))
console.log(testMarkers)

const firstMarker = findFirstMarker(parsedInput)
console.log(firstMarker)

const testMessageMarkers = parsedTest.map(signal => findMessageMarker(signal))
console.log(testMessageMarkers)

const messageMarker = findMessageMarker(parsedInput)
console.log(messageMarker)