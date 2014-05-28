var match = require('../index.js');

var chai = require('chai');
var expect = chai.expect;

describe('comparison', function () {
    var red = [53, 80, 67];
    var blue = [32, 79, -108];
    var offBlue = [32, 79, -106];

    it('should compare two colors', function () {
        var deltaE = match.compareColors(red, blue);

        expect(deltaE).to.eql(176.25833313633714);
    });

    it('should return true if colors similar', function () {
        var similarity = match.areSimilar(red, blue);

        expect(similarity).to.be.false;

        similarity = match.areSimilar(blue, offBlue);

        expect(similarity).to.be.true;
    });
});

describe('parser', function () {
    it('should create array of color values from a CSS file', function () {
        var colorVals = match.parseCssFile('./tests/simple.css');

        expect(colorVals).to.equal([
            [0, 0, 0],
            [0, 0, 0]
        ]);
    });
});