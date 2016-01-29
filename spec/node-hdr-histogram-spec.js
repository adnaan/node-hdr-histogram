/**
 * Created by abrahamkiggundu on 28/01/2016.
 */
var java = require("java");

describe('node-hdr-histogram-spec', function () {
    var hdrPlugin;

    beforeEach(function () {
        hdrPlugin = require('../index.js')(java.newLong(36000000),2);
    });

    afterEach(function () {
    });

    describe('#logging', function (done) {
        it('provides the ability to log', function () {
            hdrPlugin.recordValue(200);
            hdrPlugin.recordValue(125);
            hdrPlugin.recordValue(300);
            hdrPlugin.recordValue(456);
            hdrPlugin.recordValue(231);

            expect(hdrPlugin.getTotalCount().longValue).toBe('5');
            hdrPlugin.outputPercentileDistribution('test.log', 1000);
            //TODO: test that the file exists
            hdrPlugin.reset();
            expect(hdrPlugin.getTotalCount().longValue).toBe('0');

        });
    });
});