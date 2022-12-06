// read input.txt and test.txt
// import the necessary modules
const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split(/\r?\n\r?\n/);
const test = fs.readFileSync('test.txt', 'utf8').split(/\r?\n\r?\n/);

// first part of the file is the crate stacks, second part is the robot instructions
// last row of the crate stacks contains the crate stack labels
const crates = input[0].split(/\r?\n/);
// get test crates too
const testCrates = test[0].split(/\r?\n/);

const instructions = input[1].split(/\r?\n/);
// get test instructions too
const testInstructions = test[1].split(/\r?\n/);

// get the labels from the last row of the crate stacks, the labels are delimited by one or more spaces. Lables are in format '1', '2', '3', etc. ignore resulting empty lables
const labels = crates[crates.length - 1].split(/\s+/).filter((label) => label !== '');

// get test lables too
const testLabels = testCrates[testCrates.length - 1].split(/\s+/).filter((label) => label !== '');

// remove the last row of the crate stacks
crates.pop();
// remove the last row of the test crates
testCrates.pop();

// stacks of crates are represented by arrays of crate identifiers (letters) surrounded by brackets or three empty spaces if no crate is present
// crate identifiers are delimited by one space
// when parsing rows of crate stacks, three empty spaces in the place of a crate denotes an empty space
// crate stacks are in format
/*
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 
*/
// is parsed as 1: [Z, N], 2: [M, C, D], 3: [P]
// crate stacks are stored in an object with keys representing the stack number and values representing the stack of crates
const stacks = {};

// function that takes an array of strings and parses them into an object of stacks
// it takes the stacks object as first parameter and the array of strings names rows as second parameter
const parseStacks = (stacks, rows) => {
    // iterate over the rows in reverse order
    rows.forEach((row, index) => {
      // split the row into an array of characters
      const chars = row.split('');
      // drop every fourth character (the spaces)
      const filteredChars = chars.filter((char, index) => index % 4 !== 3);
      // split the array into an array of arrays of three characters
      const splitChars = filteredChars.reduce((acc, char, index) => {
        // [copilot] if the index is divisible by three, push a new array into the accumulator
        if (index % 3 === 0) {
          acc.push([]);
        }
        // [copilot] push the character into the last array in the accumulator
        acc[acc.length - 1].push(char);
        return acc;
      }, []);
      // iterate over the array of strings, name the element crate

      splitChars.forEach((crate, index) => {
        // push the crate into the stacks object
        // if the crate is empty, push an empty string
        stacks[index + 1] = stacks[index + 1] || [];
        stacks[index + 1].push(crate.join('') === '   ' ? '' : crate.join(''));
      });
    });

    // reverse each stack in the stacks object
    for (let i = 1; i <= Object.keys(stacks).length; i++) {
      stacks[i].reverse();
    }
    
    // remove empty strings form the end of stacks
    for (let i = 1; i <= Object.keys(stacks).length; i++) {
      while (stacks[i][stacks[i].length - 1] === '') {
        stacks[i].pop();
      }
    }
    return stacks;
};


      


// function to map the stacks object into a string
// read the topmost create of each stack and join them into a string
const mapStacks = (stacks) => {
    // [copilot] create an array to store the topmost crates of each stack
    const mapped = [];
    // [copilot] iterate over each stack
    for (let i = 1; i <= Object.keys(stacks).length; i++) {
        // add the topmost crate to the array
        mapped.push(stacks[i][stacks[i].length - 1]);
    }
    // join the crates into a string
    return mapped.join('');
}

// parse test crates and input and store them into testStacks and inputStacks
const testStacks = {};
const inputStacks = {};
parseStacks(testStacks, testCrates);
parseStacks(inputStacks, crates);

// print the mapped test stack
console.log(mapStacks(testStacks));
// print the test stack
console.log(testStacks);


// function that parses the instructions and returns an array of instructions
// instructions are in form "move 1 from 2 to 1" where the first number is the amount of crates moved, the second number is the stack the crates are moved from, and the third number is the stack the crates are moved to
const parseInstructions = (instructions) => {
    // [copilot] create an array to store the instructions
    const parsed = [];
    // [copilot] iterate over each instruction
    for (let i = 0; i < instructions.length; i++) {
        // split the instruction into an array of words
        const instruction = instructions[i].split(/\s+/);
        // [copilot] add the instruction to the array
        parsed.push({
            amount: Number(instruction[1]),
            from: Number(instruction[3]),
            to: Number(instruction[5])
        });
    }
    // [copilot] return the array of instructions
    return parsed;
}

// parse the test instructions and input instructions and store them into parsedTestInstructions and parsedInputInstructions
const parsedTestInstructions = parseInstructions(testInstructions);
const parsedInputInstructions = parseInstructions(instructions);

// print parsed test instructions
console.log(parsedTestInstructions);

// function that executes a single instruction on a object of stacks
// the function can move only one crate at a time
// when the amount of crates to move is greater than one, the function executes the instruction multiple times
const executeInstruction = (stacks, instruction) => {
    // iterate over the amount of crates to move
    for (let i = 0; i < instruction.amount; i++) {
        // get the crate to move
        const crate = stacks[instruction.from].pop();
        // add the crate to the stack
        stacks[instruction.to].push(crate);
    }
}

// function that executes a single instruction on a object of stacks
// the function can move multiple creates at a time
// when the amount creates to move is greater than one, the function moves all crates at once
const executeInstructionAll = (stacks, instruction) => {
    // get the crates to move
    const crates = stacks[instruction.from].splice(stacks[instruction.from].length - instruction.amount, instruction.amount);
    // add the crates to the stack
    stacks[instruction.to].push(...crates);
}

// create a deep copy of the test stacks
const testStacksCopy = JSON.parse(JSON.stringify(testStacks));
// create a deep copy of the input stacks
const inputStacksCopy = JSON.parse(JSON.stringify(inputStacks));

// execute the list of test instructions on the copy of the test stacks
for (let i = 0; i < parsedTestInstructions.length; i++) {
    executeInstruction(testStacksCopy, parsedTestInstructions[i]);
}

// execute the list of input instructions on the copy of the input stacks
for (let i = 0; i < parsedInputInstructions.length; i++) {
    executeInstruction(inputStacksCopy, parsedInputInstructions[i]);
}

// print the mapped test stack
console.log(mapStacks(testStacksCopy));
// print the mapped input stack
console.log(mapStacks(inputStacksCopy));

// print the original stack
console.log(testStacks);
// print the input stack
console.log(inputStacks);

// execute the list of input instructions on the input stacks, use executeInstructionAll
for (let i = 0; i < parsedInputInstructions.length; i++) {
    executeInstructionAll(inputStacks, parsedInputInstructions[i]);
}

// do the same to test stacks
for (let i = 0; i < parsedTestInstructions.length; i++) {
    executeInstructionAll(testStacks, parsedTestInstructions[i]);
}

// print the mapped test stack
console.log(mapStacks(testStacks));
// print the mapped input stack
console.log(mapStacks(inputStacks));
