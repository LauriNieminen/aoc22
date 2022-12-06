// read input.txt and test.txt
const fs = require('fs');
// split them into rows handling both LF and CRLF
const input = fs.readFileSync('input.txt', 'utf8').split(/\r?\n/);
const test = fs.readFileSync('test.txt', 'utf8').split(/\r?\n/);

// row contains two intervals separated by a comma
// intervals are separated by a dash
// intervals are integer numbers
// for example: 1-3,5-7
// parse the rows into an array of objects with start and end properties
const parseRow = row => {
  const [interval1, interval2] = row.split(',');
  const [start1, end1] = interval1.split('-');
  const [start2, end2] = interval2.split('-');
  return [
    { start: parseInt(start1), end: parseInt(end1) },
    { start: parseInt(start2), end: parseInt(end2) }
  ];
};

// parse input and test
const parsedInput = input.map(parseRow);
const parsedTest = test.map(parseRow);

// check if either the start or the end of the interval is inside other interval
const isInside = (interval1, interval2) =>
  interval1.start >= interval2.start && interval1.start <= interval2.end ||
  interval1.end >= interval2.start && interval1.end <= interval2.end;

// check if both the start and the end of the interval are inside other interval
const isInsideBoth = (interval1, interval2) =>
  interval1.start >= interval2.start && interval1.end <= interval2.end;

// count the number rows where the first interval is inside the second one or vice versa
const countInside = rows => rows.reduce((count, [interval1, interval2]) => {
  if (isInside(interval1, interval2) || isInside(interval2, interval1)) {
    return count + 1;
  }
  return count;
}, 0);

// count the number of rows where the first interval has both ends inside the second one or vice versa
const countInsideBoth = rows => rows.reduce((count, [interval1, interval2]) => {
  if (isInsideBoth(interval1, interval2) || isInsideBoth(interval2, interval1)) {
    return count + 1;
  }
  return count;
}, 0);

// test
console.log('test', countInside(parsedTest), countInsideBoth(parsedTest));

// input
console.log('input', countInside(parsedInput), countInsideBoth(parsedInput));
