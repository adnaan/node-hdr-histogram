/**
 * Created by abrahamkiggundu on 28/01/2016.
 */
var java = require("java");

describe('node-hdr-histogram-spec', function () {
    var hdrPlugin;

    beforeEach(function () {
        hdrPlugin = require('../index.js')(36000000, 2);
    });

    afterEach(function () {
    });

    describe('#logging', function () {
        it('provides the ability to log', function (done) {
            hdrPlugin.recordValue(200)
                .then(confirmLogsInList.bind({}, '1', function () {
                    hdrPlugin.outputPercentileDistribution('test.log', 1000).then(function () {
                        //TODO: test that the file exists
                        hdrPlugin.reset().then(confirmLogsInList.bind({}, '0', done));
                    });
                }));
        });

        function confirmLogsInList(num, done) {
            hdrPlugin.getTotalCount()
                .then(function (ret) {
                    expect(ret.longValue).toBe(num);
                    done();
                });
        }
    });

})
;