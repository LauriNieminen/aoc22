// read input.txt and test.txt, import necessary modules
// input.txt contains a single row (signal)
// test.txt contains multiple rows (signals)
// a signal consists of alphabetic characters
// read the files here

// read the files into input and test variables
// input is a string
// test is an array of strings

// import the module for reading files
export {};
const fs = require('fs')

// read the fucking files
const input = fs.readFileSync('input.txt', 'utf8');
const test = fs.readFileSync('test.txt', 'utf8');

// define the type of the input
type Signal = string

// define the type of the test
type Test = Signal[]

// function that finds the first 4 character substring that has distinct characters and return the index of the last character of the substring, 1-indexed
function findFirstFourDistinctCharacters(signal: Signal): number {
    let index = 0;
    let distinct = false;
    while (!distinct) {
      // if [copilot] the index is greater than the length of the signal minus 4, then there is no substring of length 4 that has distinct characters
        if (index > signal.length - 4) {
            return -1;
        }
        let substring = signal.slice(index, index + 4);
        if (new Set(substring).size === 4) {
            distinct = true;
        } else {
            index++;
        }
    }
    return index + 4;
}

// function that finds the first 14 character substring that has distinct characters and return the index of the last character of the substring, 1-indexed
function findFirstFourteenDistinctCharacters(signal: Signal): number {
    let index = 0;
    let distinct = false;
    while (!distinct) {
      // if [copilot] the index is greater than the length of the signal minus 14, then there is no substring of length 14 that has distinct characters
        if (index > signal.length - 14) {
            return -1;
        }
        let substring = signal.slice(index, index + 14);
        if (new Set(substring).size === 14) {
            distinct = true;
        } else {
            index++;
        }
    }
    return index + 14;
}

// split the test input into an array of signals, handle both CRLF and LF, trim the signals for dangling whitespace
const testSignals: Test = test.split(/\r?\n/).map((signal: Signal) => signal.trim());


// find the first 4 distinct characters in the test signals and in the input signal
const testFirstFourDistinctCharacters: number[] = testSignals.map((signal: Signal) => findFirstFourDistinctCharacters(signal));
const inputFirstFourDistinctCharacters: number = findFirstFourDistinctCharacters(input);

// find the first 14 distinct characters in the test signals and in the input signal
const testFirstFourteenDistinctCharacters: number[] = testSignals.map((signal: Signal) => findFirstFourteenDistinctCharacters(signal));
const inputFirstFourteenDistinctCharacters: number = findFirstFourteenDistinctCharacters(input);

// print the results
console.log('testFirstFourDistinctCharacters', testFirstFourDistinctCharacters);
console.log('inputFirstFourDistinctCharacters', inputFirstFourDistinctCharacters);
console.log('testFirstFourteenDistinctCharacters', testFirstFourteenDistinctCharacters);
console.log('inputFirstFourteenDistinctCharacters', inputFirstFourteenDistinctCharacters);

