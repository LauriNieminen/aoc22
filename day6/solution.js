var fs = require('fs');
var input = fs.readFileSync('input.txt', 'utf8');
var test = fs.readFileSync('test.txt', 'utf8');
var parsedInput = input.trim();
var parsedTest = test.split(/\r?\n/).map(function (signalData) { return signalData.trim(); });
var findFirstMarker = function (signal) {
    var candidate = signal.slice(0.4);
    var rest = signal.slice(4);
    var index = 3;
    debugger;
    while ((new Set(candidate)).size !== 4 && rest.length > 0) {
        candidate = candidate.slice(1);
        candidate = candidate + rest[0];
        rest = rest.slice(1);
        index++;
    }
    return index + 1;
};
var testMarkers = parsedTest.map(function (signal) { return findFirstMarker(signal); });
console.log(testMarkers);
