const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').split(/\r?\n/)

const solve = (input: string[]) => {
  let size = 0
  let children: number[] = []
  while (input.length > 0) {
    const line = input.shift()
    const parts = line!.split(' ')
    if (Number.isInteger(Number(parts[0]))) size += Number(parts[0])
    if (line === '$ cd ..') return {newChildren: [size, ...children], levelSize: size}
    if (line!.includes('$ cd ')) {
      const {newChildren, levelSize} = solve(input)
      size += levelSize
      children.push(...newChildren)
    }
  }
  return {newChildren: [size, ...children], levelSize: size}
}

const dirSizes = solve(input.slice(1)).newChildren.sort((a,b) => a-b)
console.log(dirSizes.filter(a => a <= 100000).reduce((a,b) => a+b, 0))
console.log(dirSizes.find(s => s >= 30000000 - (70000000 - dirSizes[dirSizes.length - 1])))

export {};