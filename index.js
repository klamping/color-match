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
        hex: /#([0-9a-f]{3}){1,2};?(?![\S]{1})/,
        rgb: /rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/,
        rgba: /(?:(?:(?:rgba)(?=\((?:[0-9\.]+%?,?\s*){4}\)))\s*\(([0-9\.]+%?)(?:,\s*0*\1){2}(?:,\s*[0-9\.]+%?)?\s*\))/
    },
    // hsl(20,0%,  50%)
    // hsl(0, 10%, 100%)
    // hsl(0.5, 10.5%, 0%)
    // hsl(5, 5%, 0%)
    // hsla(20, 0%, 50%, 0.88)
    // hsla(0, 0%, 0%, 0.25)
    hsl: /hsla?\(.+,\s*(?:(?:0%,\s*\d+%)|(?:.+%,\s*(?:10)?0%))(?:,.*)?\)/
};

var getNumeric = function (color) {
    return parseInt(color, 16);
};

var hexToRgb = function (color) {
    if (color[0] === '#') {
        color = color.split('#')[1];
    }

    if (color.length === 3) {
        color += color;
    }

    var red = getNumeric(color.substring(0,2));
    var green = getNumeric(color.substring(2,4));
    var blue = getNumeric(color.substring(4,6));

    return [red, green, blue];
};

var convertToLab = function (color, type) {
    switch (type) {
        case 'hex':
            var rgb = hexToRgb(color);
            return converter.rgb2lab(rgb);
        default:
            return false;
    }
};

var findColors = function (parsed) {
    var colors = {};

    _.each(parsed, function (ruleset) {
        _.each(ruleset.declarations, function (declaration) {
            var value = declaration.value;
            var line = declaration.position.start.line;

            var color;

            if (value.match(matches.rgb.hex)) {
                color = convertToLab(value, 'hex');
            }

            // if a shorthand property, separate out values

            // check for keyword colors

            // check for rgb colors

            // check for hsl colors

            if (color) {
                colors[line] = color;
            }
        });
    });

    return colors;
};

exports.parseCssFile = function (filepath) {
    var css = loadCssFile(filepath);

    var parsedCss = parse(css, {
        position: true
    });

    return findColors(parsedCss.stylesheet.rules);
};

exports.findDeltaEs = function (colors) {
    var deltas = {};

    // loop through every color, match against others
    // if < delta, return result
    _.each(colors, function (colorA, lineA) {
        deltas[lineA] = {};

        _.each(colors, function (colorB, lineB) {
            // don't compare if we've already compared
            if (lineA < lineB) {
                var delta = exports.compareColors(colorA, colorB);
                deltas[lineA][lineB] = delta;
            }
        });
    });

    return deltas;
};

exports.reportCloseMatches = function (colorDeltas, deltaLimit) {
    if (!_.isNumber(deltaLimit)) {
        // set default to defined scientific Just Noticable Difference
        // @see http://en.wikipedia.org/wiki/Just_noticeable_difference
        deltaLimit = 2.3;
    }

    var matches = _.mapValues(colorDeltas, function (color, lineA) {
        var results = {};

        _.each(color, function (delta, lineB) {
            results[lineB] = delta !== 0 && delta < deltaLimit;
        });

        return results;
    });

    return matches;
};

exports.kitchenSink = function (filepath, deltaLimit) {
    // parse CSS file
    var colors = exports.parseCssFile(filepath);

    // find deltaEs
    var deltas = exports.findDeltaEs(colors);

    // find matches
    var matches = exports.reportCloseMatches(deltas, deltaLimit);

    return matches;
};