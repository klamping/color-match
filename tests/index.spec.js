var match = require('../index.js');

var chai = require('chai');
var expect = chai.expect;

var _ = require('lodash');

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
        var colors = match.parseCssFile('./tests/single-color.css');

        var converted = {
            2: [57, 0, 0]
        };

        expect(colors[2][0]).to.equal(converted[2][0]);
        expect(colors[2][1]).to.equal(converted[2][1]);
        expect(colors[2][2]).to.equal(converted[2][2]);
    });

    it('should find multiple hex values', function () {
        var colors = match.parseCssFile('./tests/two-hex-color.css');

        var converted = {
            2: [57, 0, 0],
            5: [30, 76, -103]
        };

        expect(colors[2][0]).to.equal(converted[2][0]);
        expect(colors[2][1]).to.equal(converted[2][1]);
        expect(colors[2][2]).to.equal(converted[2][2]);

        expect(colors[5][0]).to.equal(converted[5][0]);
        expect(colors[5][1]).to.equal(converted[5][1]);
        expect(colors[5][2]).to.equal(converted[5][2]);
    });
});

describe('matchFinder', function () {
    var colors = {
        0: [57, 0, 0],
        5: [30, 76, -103],
        988: [30, 76, -102]
    };

    var deltas = {
        0: {
            5: 130.82048769210425,
            988: 130.034610777285
        },
        5: {
            988: 1
        },
        988: {}
    };

    var report = {
        0: {
            5: false,
            988: false
        },
        5: {
            988: true
        },
        988: {}
    };

    it('should find deltas for colors', function () {
        var results = match.findDeltaEs(colors);

        expect(results).to.eql(deltas);
    });

    it('should report close matches', function () {
        var results = match.reportCloseMatches(deltas);

        expect(results).to.eql(report);
    });

    it('should allow custom delta', function () {
        var looseReport = _.clone(report);

        looseReport[0] = {
            5: true,
            988: true
        };

        var results = match.reportCloseMatches(deltas, 134);

        expect(results).to.eql(looseReport);
    });
});

describe('program', function () {
    var report = {
        2: {
            3: false,
            7: false
        },
        3: {
            7: true
        },
        7: {}
    };

    it('should generate report from css file', function () {
        var results = match.kitchenSink('./tests/simple.css');

        expect(results).to.eql(report);
    });

    it('should allow for a custom delta', function () {
        var results = match.kitchenSink('./tests/simple.css', 100);

        var looseReport = _.clone(report);
        looseReport[2][3] = true;
        looseReport[2][7] = true;

        expect(results).to.eql(looseReport);
    });
});