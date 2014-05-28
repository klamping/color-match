var converter = require('color-convert');
var parse = require('css-parse');

var distance = function (a, b) {
    return (a - b) * (a - b);
};

var configs = {
    maxDelta: 2
};

exports.compareColors = function (colorA, colorB) {
    var deltaE;

    var partA = distance(colorA[0], colorB[0]);
    var partB = distance(colorA[1], colorB[1]);
    var partC = distance(colorA[2], colorB[2]);

    deltaE = Math.sqrt(partA + partB + partC);

    return deltaE;
};

exports.areSimilar = function (colorA, colorB) {
    var delta = exports.compareColors(colorA, colorB);

    return delta <= configs.maxDelta;
};