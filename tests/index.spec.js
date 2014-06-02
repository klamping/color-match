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
    it('should find a hex value and convert it to LAB', function () {
        var colorVals = match.parseCssFile('./tests/single-color.css');

        var converted = [57, 0, 0];

        expect(converted[0]).to.equal(colorVals[0][0]);
        expect(converted[1]).to.equal(colorVals[0][1]);
        expect(converted[2]).to.equal(colorVals[0][2]);
        // expect(colorVals).to.eql(converted);
    });

    it('should find multiple hex values', function () {
        var colorVals = match.parseCssFile('./tests/two-hex-color.css');

        var converted = [
            [57, 0, 0],
            [30, 76, -103]
        ];

        expect(converted[0][0]).to.equal(colorVals[0][0]);
        expect(converted[0][1]).to.equal(colorVals[0][1]);
        expect(converted[0][2]).to.equal(colorVals[0][2]);

        expect(converted[1][0]).to.equal(colorVals[1][0]);
        expect(converted[1][1]).to.equal(colorVals[1][1]);
        expect(converted[1][2]).to.equal(colorVals[1][2]);


        expect(colorVals).to.eql(converted);
    });
});