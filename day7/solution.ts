export {};

const fs = require('fs');
const test = fs.readFileSync('test.txt', 'utf8').split(/\r?\n(?=\$)/).map((command: string) => command.split(/\r?\n/))
const input = fs.readFileSync('input.txt', 'utf8').split(/\r?\n(?=\$)/).map((command: string) => command.split(/\r?\n/))

console.log(test)

type File = {
  type: 'file'
  name: string
  size: number
}

type FolderChildren = {
  [key: string]: File | Folder
}

type Folder = {
  type: 'folder'
  name: string
  children: FolderChildren
}

type Position = string[]

type FileSystemState = {
  fileTree: Folder
  position: Position
}

const handleChangeDirectory = (position: Position, arg: string): Position => {
  switch (arg) {
    case "..":
      return position.slice(0, -1);
    case "/":
      return ["/"];
    default:
      return [...position, arg];
  }
}

const dirPathExist = (path: Position, state: FileSystemState): boolean =>
// @ts-ignore
  Boolean(path.reduce((acc, curr, index) => {
    if (index === 0 && curr === '/') {
      // @ts-ignore
      if (acc.name !== '/') {
        throw new Error("Root folder does not exist")
      }
      // @ts-ignore
      return acc
    }

    // @ts-ignore
    if (!acc || acc.type === 'file') {
      return false
    }
    
    if (acc.children[curr]) {
      // @ts-ignore
      return acc.children[curr]
    }
  }, state.fileTree))

const setDeepPropWithPath = (obj: Folder, path: Position, value: File | Folder): void => {
  for (const key of path) {
    if (key === '/' && obj.name == '/') {
      continue
    }

    if (obj.children && obj.children[key] && obj.children[key].type === "file") {
      throw new Error("Cannot set property of file")
    }

    if (!obj.children) {
      obj.children = {}
    }


    if (!obj.children[key]) {
      obj.children[key] = {
        type: "folder",
        name: key,
        children: {}
      }
    }
    // @ts-ignore checked above
    obj = obj.children[key]
  }

  obj.children[value.name] = value
}

const setChilrenWithPath = (children: string[], path: Position, state: FileSystemState): FileSystemState => {
  const parsedChildren = children.map((child: string) => {
    const tokens = child.split(' ');
    if (tokens[0] === 'dir') {
      return {
        type: 'folder',
        name: tokens[1],
        children: {}
      } as Folder
    }
      return {
        type: "file",
        name: tokens[1],
        size: Number(tokens[0]),
      } as File
  })

  let newState = JSON.parse(JSON.stringify(state))
  parsedChildren.forEach((child) => {
    setDeepPropWithPath(newState.fileTree, path, child)
  })

  return newState
}

const parseCommand = (lines: string[], state: FileSystemState): FileSystemState => {
  const command = lines[0];
  const result = lines.slice(1);

  const [_, instruction, arg] = command.split(' ');
  switch (instruction) {
    case 'cd': {
      const newPath = handleChangeDirectory(state.position, arg)
      if (!dirPathExist(newPath, state)) {
        setDeepPropWithPath(state.fileTree, newPath, { type: 'folder', name: arg, children: {} })
      }
      return {
        ...state,
        position: newPath
      }
    }

    case 'ls':
      return setChilrenWithPath(result, state.position, state)

    default:
      return state;
  }
}

const printFileTree = (fileTree: Folder | File, depth: number = 0, indentation: number = 2): void => {
  let line = ''
  line += ' '.repeat(depth) + '- '
  if (fileTree.type === 'file') {
    line += fileTree.name
    line += ` (file, size=${fileTree.size})`
    console.log(line)
  } else {
    line += fileTree.name
    line += ` (dir)`
    console.log(line)
    if (fileTree.children) {
      Object.values(fileTree.children).forEach((child) => printFileTree(child, depth + indentation))
    }
  }
}

const getDirSize = (fileTree: Folder | File): number => {
  if (fileTree.type === 'file') {
    return fileTree.size
  }

  if (fileTree.children) {
    return Object.values(fileTree.children).reduce((acc, curr) => acc + getDirSize(curr), 0)
  }

  return 0
}

const limit = 100000

const solve1 = (fileTree: Folder | File, limit: number, result: number[] = []): number[] => {
  if (fileTree.type === 'file') {
    return result
  }

  const dirSize = getDirSize(fileTree)
  const children = Object.values(fileTree.children).map(child => solve1(child, limit))
  if (dirSize <= limit) {
    return [dirSize, ...children.flat()]
  }

  return children.flat()
}

const parsedtest = test.reduce((acc: FileSystemState, curr: string[]) => parseCommand(curr, acc), { fileTree: { name: '/', type: 'folder', children: {}}, position: [] } as FileSystemState)
const parsedInput = input.reduce((acc: FileSystemState, curr: string[]) => parseCommand(curr, acc), { fileTree: { name: '/', type: 'folder', children: {}}, position: [] } as FileSystemState)

printFileTree(parsedtest.fileTree)
printFileTree(parsedInput.fileTree)

console.log(solve1(parsedtest.fileTree, limit).reduce((acc, curr) => acc + curr, 0))
console.log(solve1(parsedInput.fileTree, limit).reduce((acc, curr) => acc + curr, 0))

const solve2 = (dirSizes: number[], totalSpace: number, neededSpace: number): number | undefined => {
  const sortedDirSizes = dirSizes.sort((a,b) => a - b)
  const usedSpace = sortedDirSizes[sortedDirSizes.length - 1]
  const missingSpace = neededSpace - (totalSpace - usedSpace)
  console.log('sorted ', sortedDirSizes)
  console.log('missing ', missingSpace)
  if (missingSpace <= 0) {
    return 0
  }

  return sortedDirSizes.find(a => a >= missingSpace)
}

const totalSpace = 70000000
const neededSpace = 30000000

const dirSizes = solve1(parsedInput.fileTree, totalSpace)
console.log(dirSizes.length)

console.log(solve2(solve1(parsedtest.fileTree, totalSpace), totalSpace, neededSpace))
console.log(solve2(solve1(parsedInput.fileTree, totalSpace), totalSpace, neededSpace))