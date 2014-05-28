var converter = require('color-convert');
var parse = require('css-parse');
var fs = require('fs');
var _ = require('lodash');
var colors = require('./colors');

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

var loadCssFile = function (filepath) {
    return fs.readFileSync(filepath).toString();
};


var matches = {
    keyword: colors, // array of keywords
    rgb: {
        '#': /#([0-9a-f]{3}){1,2}(?=[; ]{1})/,
        'rgb': /rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/,
        'rgba': /(?:(?:(?:rgba)(?=\((?:[0-9\.]+%?,?\s*){4}\)))\s*\(([0-9\.]+%?)(?:,\s*0*\1){2}(?:,\s*[0-9\.]+%?)?\s*\))/
    },
    // hsl(20,0%,  50%)
    // hsl(0, 10%, 100%)
    // hsl(0.5, 10.5%, 0%)
    // hsl(5, 5%, 0%)
    // hsla(20, 0%, 50%, 0.88)
    // hsla(0, 0%, 0%, 0.25)
    hsl: /hsla?\(.+,\s*(?:(?:0%,\s*\d+%)|(?:.+%,\s*(?:10)?0%))(?:,.*)?\)/
};

var convertToLab = function (color, type) {
};

var findColors = function (parsed) {
    var colors = [];

    _.each(parsed, function (ruleset) {
        _.each(ruleset.declarations, function (declaration) {
            var value = declaration.value;

            console.log(value);

            // if a shorthand property, separate out values

            // check for keyword colors

            // check for rgb colors

            // check for hsl colors
        });
    });

    return colors;
};

exports.parseCssFile = function (filepath) {
    var css = loadCssFile(filepath);

    var parsedCss = parse(css);

    return findColors(parsedCss.stylesheet.rules);
};