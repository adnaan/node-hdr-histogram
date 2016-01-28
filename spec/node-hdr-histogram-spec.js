/**
 * Created by abrahamkiggundu on 28/01/2016.
 */

describe('node-hdr-histogram-spec', function () {
    var hdrPlugin;

    beforeEach(function () {
        hdrPlugin = require('../index.js')(20,2);
    });

    afterEach(function () {
    });

    describe('#logging', function (done) {
        it('provides the ability to log', function () {
            hdrPlugin.recordValue(2);

            expect(hdrPlugin.getTotalCount().longValue).toBe('1');
        });
    });
});