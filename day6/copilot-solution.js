// read input.txt and test.txt, import necessary modules
// input.txt contains a single row (signal)
// test.txt contains multiple rows (signals)
// a signal consists of alphabetic characters
// read the files here
// read the files into input and test variables
// input is a string
// test is an array of strings
// import the module for reading files
var fs = require('fs');
// read the fucking files
var input = fs.readFileSync('input.txt', 'utf8');
var test = fs.readFileSync('test.txt', 'utf8');
