export {}

const fs = require('fs')

const input: string[] = fs.readFileSync('input.txt', 'utf8').split(/\r?\n/)
const testInput: string[] = fs.readFileSync('test.txt', 'utf8').split(/\r?\n/)

const DEBUG_PRINT = process.argv.slice(2).some(arg => arg === '--debug')

type Move = {
  direction: string
  distance: number
}

type Coords = {
  x: number
  y: number
  label?: number
}

type State = Coords[]

const parseInput = (input: string[]): Move[] => input.map(row =>  {
  const [direction, distance] = row.split(' ')
  return {
    direction,
    distance: Number(distance)
  }
})

const inputMoves = parseInput(input)
const testMoves = parseInput(testInput)

const printCoord = (coord: Coords): string => `${coord.x},${coord.y}`

const l_inf = (a: Coords, b: Coords): number => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y))

const tailStep = (first: Coords, second: Coords): Coords => {
  const dx = Math.sign(first.x - second.x) || 0
  const dy = Math.sign(first.y - second.y) || 0
  return {
      ...second,
      x: second.x + dx,
      y: second.y + dy
    }
}

const resolveNodePair = (first: Coords, second: Coords, visited: Set<string>, saveVisited: boolean, state: State): Coords => {
  if (l_inf(first, second) > 1) {
    second = tailStep(first, second)
    if (saveVisited) {
      visited.add(printCoord(second))
      printStateAndVisited(state, visited)
    }
    return resolveNodePair(first, second, visited, saveVisited, state)
  }
  return second
}

const headStep = (head: Coords, move: Move): Coords => {
  const { direction, distance } = move
  const dx = direction === 'R' ? distance : direction === 'L' ? -distance : 0
  const dy = direction === 'U' ? distance : direction === 'D' ? -distance : 0
  return {
      x: head.x + dx,
      y: head.y + dy
  }
}

const doMove = (state: State, move: Move, visited: Set<string>): State => {
  for (let i = 0; i < move.distance; i++) {

    const [head, ...tail] = state
    state = [headStep(head, {...move, distance: 1 }), ...tail]
    
    tail.forEach((tailCoord, index) => {
      const first = state[index]
      const isLast = index === tail.length - 1
      const second = resolveNodePair(first, tailCoord, visited, isLast, state)
      
      state[index + 1] = second
    })
    printStateAndVisited(state, visited)
  }
  return state
}

const printStateAndVisited = (state: State, visited: Set<string>) => {
  if (!DEBUG_PRINT) return  
  const [head, ...tail] = state
  const xMin = Math.min(head.x, ...tail.map(coord => coord.x), ...Array.from(visited.values()).map(coord => Number(coord.split(',')[0])))
  const yMin = Math.min(head.y, ...tail.map(coord => coord.y), ...Array.from(visited.values()).map(coord => Number(coord.split(',')[1])))
  
  const xOffset = -Math.min(xMin, 0)
  const yOffset = -Math.min(yMin, 0)

  const xMax = Math.max(head.x, ...tail.map(coord => coord.x), ...Array.from(visited.values()).map(coord => Number(coord.split(',')[0])))
  const yMax = Math.max(head.y, ...tail.map(coord => coord.y), ...Array.from(visited.values()).map(coord => Number(coord.split(',')[1])))

  const grid = Array(yMax - yMin + 1).fill('.').map(() => Array(xMax - xMin + 1).fill('.'))
  grid[head.y + yOffset][head.x + xOffset] = 'H'
  visited.forEach(coord => {
    const [x, y] = coord.split(',').map(Number)
    grid[y + yOffset][x + xOffset] = '#'
  })
  tail.forEach((coord, index) => {
    const x = coord.x + xOffset
    const y = coord.y + yOffset
    if (grid[y][x] === '#' || grid[y][x] === '.') grid[y][x] = (index + 1).toString()
  })
  //grid[yOffset][xOffset] = 'O'
  console.log(grid.map(row => row.join(' ')).reverse().join('\n'), '\n')
}

const testVisited = new Set<string>()
const testInitialState: State = [{ x: 0, y: 0 }, { x: 0, y: 0 }]
testVisited.add(printCoord(testInitialState[testInitialState.length - 1]))

const testState = testMoves.reduce((state, move) => doMove(state, move, testVisited), testInitialState)
console.log(testVisited.size)

const visited = new Set<string>()
const initialState: State = [{ x: 0, y: 0 }, { x: 0, y: 0 }]
visited.add(printCoord(initialState[initialState.length - 1]))

const state = inputMoves.reduce((state, move) => doMove(state, move, visited), initialState)
console.log(visited.size)


const testVisited2 = new Set<string>()
const testInitialState2: State = Array(10).fill({ x: 0, y: 0 })
testVisited2.add(printCoord(testInitialState2[testInitialState2.length - 1]))

const testState2 = testMoves.reduce((state, move) => doMove(state, move, testVisited2), testInitialState2)
console.log(testVisited2.size)

const visited2 = new Set<string>()
const initialState2: State = Array(10).fill({ x: 0, y: 0 })
visited2.add(printCoord(initialState2[initialState2.length - 1]))

const state2 = inputMoves.reduce((state, move) => doMove(state, move, visited2), initialState2)
console.log(visited2.size)