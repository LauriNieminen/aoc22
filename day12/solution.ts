export {};
import fs from "fs";
import chalk from "chalk";

import FastPriorityQueue from "fastpriorityqueue";

const input = fs
  .readFileSync("input.txt", "utf8")
  .split(/\r?\n/)
  .map((row) => row.split(""));
const test = fs
  .readFileSync("test.txt", "utf8")
  .split(/\r?\n/)
  .map((row) => row.split(""));

type IntermediateGridCoord = {
  char: string;
  x: number;
  y: number;
  level: number;
  label: string;
};

type GridCoord = IntermediateGridCoord & {
  neighbors: string[];
};

type GCwithPriority = GridCoord & {
  priority: number;
};

const parseIntoMap = (
  input: string[][]
): { [key: string]: IntermediateGridCoord } => {
  const map: { [key: string]: IntermediateGridCoord } = {};
  input.forEach((row, x) => {
    row.forEach((char, y) => {
      const key = `${x},${y}`;
      if (char === "S") {
        map[key] = {
          char,
          label: "start",
          x,
          y,
          level: "a".charCodeAt(0),
        };
      } else if (char === "E") {
        map[key] = {
          char,
          label: "end",
          x,
          y,
          level: "z".charCodeAt(0),
        };
      } else {
        map[key] = {
          char,
          label: key,
          level: char.charCodeAt(0),
          x,
          y,
        };
      }
    });
  });
  return map;
};

const addNeighbors = (map: {
  [key: string]: IntermediateGridCoord;
}): { [key: string]: GridCoord } => {
  const newMap: { [key: string]: GridCoord } = {};
  Object.values(map).forEach((coord) => {
    const { x, y } = coord;
    const neighbors = [];
    if (map[`${x - 1},${y}`] && map[`${x - 1},${y}`].level - coord.level <= 1) {
      neighbors.push(`${x - 1},${y}`);
    }
    if (map[`${x + 1},${y}`] && map[`${x + 1},${y}`].level - coord.level <= 1) {
      neighbors.push(`${x + 1},${y}`);
    }
    if (map[`${x},${y - 1}`] && map[`${x},${y - 1}`].level - coord.level <= 1) {
      neighbors.push(`${x},${y - 1}`);
    }
    if (map[`${x},${y + 1}`] && map[`${x},${y + 1}`].level - coord.level <= 1) {
      neighbors.push(`${x},${y + 1}`);
    }
    newMap[`${x},${y}`] = {
      ...map[`${x},${y}`],
      neighbors,
    };
  });
  return newMap;
};

const testMap = addNeighbors(parseIntoMap(test));
const map = addNeighbors(parseIntoMap(input));

const printPath = (path: string[], map: { [key: string]: GridCoord }) => {
  const xMax = Math.max(...Object.values(map).map((coord) => coord.x));
  const yMax = Math.max(...Object.values(map).map((coord) => coord.y));

  for (let y = 0; y <= yMax; y++) {
    let row = "";
    for (let x = 0; x <= xMax; x++) {
      const key = `${x},${y}`;
      if (path.includes(key)) {
        row +=
          path.indexOf(key) === path.length - 1
            ? chalk.green(map[key].char)
            : chalk.red(map[key].char);
      } else if (map[key]) {
        row += map[key].char;
      } else {
        row += " ";
      }
    }
    console.log(row);
  }
  console.log("\n");
};

const findShortestPath = (
  map: { [key: string]: GridCoord },
  start: GridCoord
): string[] => {
  const end = Object.values(map).find((coord) => coord.label === "end")!;

  const queue = new FastPriorityQueue<GCwithPriority>(
    (a, b) => a.priority < b.priority
  );
  const distance = { [`${start.x},${start.y}`]: 0 };
  const previous: { [key: string]: GridCoord | null } = {};

  Object.values(map).forEach((coord) => {
    if (coord.label !== start.label) {
      if (coord.label === "end") {
        const key = `${coord.x},${coord.y}`;
        distance[key] = Infinity;
        previous[key] = null;
      } else {
        distance[coord.label] = Infinity;
        previous[coord.label] = null;
      }
    }
    queue.add({ ...coord, priority: distance[coord.label] });
  });

  while (queue.size > 0) {
    const current = queue.poll()!;

    current.neighbors.forEach((neighbor) => {
      const key = `${current.x},${current.y}`;
      const alt = distance[key] + 1;
      if (alt < distance[neighbor]) {
        distance[neighbor] = alt;
        previous[neighbor] = current;
        const updatedNeighBor = { ...map[neighbor], priority: alt };
        queue.removeOne((coord) => coord.label === updatedNeighBor.label);

        queue.add(updatedNeighBor);
      }
    });
  }

  const path = [];
  let current = end;
  if (!previous[`${current.x},${current.y}`]) {
    return Array(1000).fill('asd')
  }
  while (current.label !== start.label) {
    path.push(`${current.x},${current.y}`);
    const key = `${current.x},${current.y}`;
    current = previous[key]!;
    if (!current) {
      debugger;
      return Array(1000).fill('asd')
    }
  }
  path.push(`${current.x},${current.y}`);
  return path.reverse();
};

const testStart = Object.values(testMap).find(
  (coord) => coord.label === "start"
)!;
const inputStart = Object.values(map).find((coord) => coord.label === "start")!;

const shortesTestPath = findShortestPath(testMap, testStart);
console.log(shortesTestPath, shortesTestPath.length - 1);

const shortestPath = findShortestPath(map, inputStart);
console.log(shortestPath, shortestPath.length - 1);

const testAs = Object.values(testMap).filter((coord) => coord.char === "a");

const testADists = testAs.map(
  (coord) => findShortestPath(testMap, coord).length
);
console.log(Math.min(...testADists) - 1);

const inputAs = Object.values(map).filter((coord) => coord.char === "a");
const inputADists = inputAs.map((coord) => findShortestPath(map, coord).length);
console.log(Math.min(...inputADists) - 1);
