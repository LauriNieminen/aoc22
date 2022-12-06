const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split(/\r?\n\r?\n/);
const test = fs.readFileSync('test.txt', 'utf8').split(/\r?\n\r?\n/);

const testSetup = test[0]
const inputSetup = input[0]

const testStepData = test[1]
const inputStepData = input[1]


const parseSetupRow = (row) => {
  if (row === '') {
    return []
  }
  if (row.slice(2) === ' [') {
    return [row.slice(1)]
  }
  if (row[0] === '[') {
    return [row[1], ...parseSetupRow(row.slice(4))]
  }
  if (row.slice(0,4) === '    ') {
    return [null, ...parseSetupRow(row.slice(4))]
  }
  if (row === '   ') {
    return [null]
  }
}

const parseSetup = (setup) => {
  const rows = setup.split(/\r?\n/)
  const columns = rows[rows.length - 1].trim().split(/\s+/).reduce((acc, column) => ({ ...acc, [column]: [] }), {})
  const columnLength = columns.length
  const crateRows = rows.slice(0, rows.length - 1).map(row => parseSetupRow(row))

  crateRows.reverse().forEach((crateRow) => {
    crateRow.forEach((crate, index) => {
      if (crate !== null) {
        columns[index + 1].push(crate)
      }
    })
  })
  return columns
}

const parseStep = (row) => {
  const nums = row.split(/\s+/).filter(token => /\d+/.test(token)).map(Number)
  return {
    amount: nums[0],
    from: nums[1],
    to: nums[2]
  }
}

const parseSteps = (stepData) => {
  const steps = stepData.split(/\r?\n/).map(row => parseStep(row))
  const resolvedSteps = steps.flatMap(step => {
    return Array(step.amount).fill({ from: step.from, to: step.to })
  })
  return resolvedSteps
}

const parseSteps2 = (stepData) => {
  const steps = stepData.split(/\r?\n/).map(row => parseStep(row))
  return steps
}

const doStep = (columns, step) => {
  const { from, to } = step
  const crate = columns[from].pop()
  columns[to].push(crate)
}

const doStep2 = (columns, step) => {
  const { amount, from, to } = step
  const crates = columns[from].slice(columns[from].length - amount)
  columns[from] = columns[from].slice(0, columns[from].length - amount)
  columns[to] = [...columns[to], ...crates]
}

const getResult = (columns) => {
  return Object.values(columns).map(column => column.pop()).join('')
}

const testState = parseSetup(testSetup)
const testState2 = parseSetup(testSetup)
const testSteps = parseSteps(testStepData)
const testSteps2 = parseSteps2(testStepData)

console.log('starting State', testState)
console.log('parsed steps', testSteps)

testSteps.forEach(step => doStep(testState, step))

console.log('ending State', testState)
console.log('test result', getResult(testState))

const inputState = parseSetup(inputSetup)
const inputState2 = parseSetup(inputSetup)
const inputSteps = parseSteps(inputStepData)
const inputSteps2 = parseSteps2(inputStepData)

inputSteps.forEach(step => doStep(inputState, step))
const inputResult = getResult(inputState)

console.log('input result', inputResult)

testSteps2.forEach(step => doStep2(testState2, step))
console.log('ending State 2', testState2)
console.log('test result 2', getResult(testState2))

inputSteps2.forEach(step => doStep2(inputState2, step))
const inputResult2 = getResult(inputState2)
console.log('input result 2', inputResult2)