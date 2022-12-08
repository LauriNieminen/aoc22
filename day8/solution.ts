export {};
const fs = require('fs')

const input = fs.readFileSync('input.txt', 'utf8').split(/\r?\n/).map((row: string) => row.split('').map(Number))
const testInput = fs.readFileSync('test.txt', 'utf8').split(/\r?\n/).map((row: string) => row.split('').map(Number))

type Coords = {
  x: number
  y: number
}

const transpose = (rows: number[][]): number[][] => rows[0].map((_, c) => rows.map(row => row[c]))
const reverseRows = (rows: number[][]): number[][] => rows.map(row => row.reverse())
const reverseRowIndices = (row: number[], len: number): number[] => row.map(el => len - 1 - el)

const checkRow = (row: number[]): number[] => {
  let highest = -1
  let visibleIndices: number[] = []
  
  row.forEach((tree, index) => {
    if (tree > highest) {
      highest = tree
      visibleIndices.push(index)
    }
  })

  return visibleIndices
}

const printCoords = (coords: Coords): string => `${coords.x}-${coords.y}`

const solve1 = (rows: number[][]): Set<string> => {
  const visibleCoords = new Set<string>()
  rows.forEach((row, y) => {
    checkRow(row).forEach(x => visibleCoords.add(printCoords({x, y})))
  })

  rows = reverseRows(rows)
  rows.forEach((row, y) => {
    const indices = checkRow(row)
    const reversedIndices = reverseRowIndices(indices, row.length)
    const coordsArr = reversedIndices.map(x => printCoords({x,y}))
    coordsArr.forEach(coords => visibleCoords.add(coords))
  })

  rows = transpose(reverseRows(rows))
  rows.forEach((row, x) => {
    const indices = checkRow(row)
    const coordsArr = indices.map(y => printCoords({x, y}))
    coordsArr.forEach(coords => visibleCoords.add(coords))
  })

  rows = reverseRows(rows)
  rows.forEach((row, x) => {
    reverseRowIndices(checkRow(row), row.length).forEach(y => visibleCoords.add(printCoords({x, y})))
  })

  return visibleCoords
}

console.log(solve1(testInput).size)
console.log(solve1(input).size)


const takeUntilPlusOne = (arr: number[], predicate: (el: number) => boolean): number[] => {
  let i = 0
  while (i + 1 < arr.length && !predicate(arr[i + 1])) i++
  if (i  + 1 < arr.length) i++
  return arr.slice(1, i + 1)
}

const getScore = (coords: Coords, rows: number[][]): number => {
  const {x, y} = coords
  const currentHeight = rows[y][x]
  const xLength = rows[0].length
  const yLength = rows.length

  const rightTrees = takeUntilPlusOne(rows[y].slice(x), tree => tree >= currentHeight)
  
  rows = reverseRows(rows)
  const leftTrees = takeUntilPlusOne(rows[y].slice(xLength - x - 1), tree => tree >= currentHeight)

  rows = transpose(reverseRows(rows))
  const downTrees = takeUntilPlusOne(rows[x].slice(y), tree => tree >= currentHeight)

  rows = reverseRows(rows)
  const upTrees = takeUntilPlusOne(rows[x].slice(yLength - y - 1), tree => tree >= currentHeight)

  return rightTrees.length * leftTrees.length * downTrees.length * upTrees.length
}

console.log(getScore({x: 2, y: 1}, testInput))
console.log(getScore({x: 2, y: 3}, testInput))

const safeGetHeight = (coords: Coords, rows: number[][]): number => {
  const {x, y} = coords
  const xLength = rows[0].length
  const yLength = rows.length

  if (x < 0 || x >= xLength || y < 0 || y >= yLength) return -1
  return rows[y][x]
}

const isPeakOrSaddle = (coords: Coords, rows: number[][]): boolean => {
  const {x, y} = coords
  const currentHeight = rows[y][x]

  const rightTree = safeGetHeight({x: x + 1, y}, rows)
  const leftTree = safeGetHeight({x: x - 1, y}, rows)
  const downTree = safeGetHeight({x, y: y + 1}, rows)
  const upTree = safeGetHeight({x, y: y - 1}, rows)

  return currentHeight >= rightTree && currentHeight >= leftTree
    && currentHeight >= downTree && currentHeight >= upTree
}

const findPeaksAndSaddles = (rows: number[][]): Coords[] => {
  const peaksAndSaddles: Coords[] = []
  rows.forEach((row, y) => {
    row.forEach((tree, x) => {
      if (isPeakOrSaddle({x, y}, rows)) peaksAndSaddles.push({x, y})
    })
  })

  return peaksAndSaddles
}

const solve2 = (rows: number[][]): number => {
  let maxScore = 0
  rows.forEach((row, y) => {
    row.forEach((tree, x) => {
      const score = getScore({x, y}, rows)
      if (score > maxScore) maxScore = score
    })
  })

  return maxScore
}

const solve2_2 = (coords: Coords[], rows: number[][]): number => {
  let maxScore = 0
  coords.forEach(({x, y}) => {
    const score = getScore({x, y}, rows)
    if (score > maxScore) maxScore = score
  })
  return maxScore
}

const testPeaksAndSaddles = findPeaksAndSaddles(testInput)
const inputPeaksAndSaddles = findPeaksAndSaddles(input)

console.log(input.length * input[0].length)
console.log(inputPeaksAndSaddles.length)

console.log(solve2_2(testPeaksAndSaddles, testInput))
console.log(solve2_2(inputPeaksAndSaddles, input))
