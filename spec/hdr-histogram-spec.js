/**
 * Created by abrahamkiggundu on 28/01/2016.
 */
var java = require("java");

describe('node-hdr-histogram-spec', function () {
    var hdrPlugin;

    beforeEach(function () {
        hdrPlugin = require('../index.js')(2000000, 1, 5, 'example.histogram.hlog');
    });

    afterEach(function () {
    });

    describe('#logging', function () {
        it('provides the ability to log', function (done) {
            hdrPlugin.recordValue(200)
                .then(confirmLogsInList.bind({}, '0', function () {
                    //TODO: test that the file exists
                    hdrPlugin.reset().then(confirmLogsInList.bind({}, '0', done));
                }));
        });

        it('save some random values into log files', function (done) {
            hdrPlugin.reset().then(function () {
                recordAValue(15, hdrPlugin, done);
            });
        }, 30000);

        function recordAValue(valueIndex, hdrPlugin, done) {
            if (valueIndex > 0) {
                setTimeout(function () {
                    var value = Math.floor(Math.random() * 1000 * 1000);
                    hdrPlugin.recordValue(value);
                    recordAValue(--valueIndex, hdrPlugin, done);
                }, Math.random() * 1000);
            }
            else {
                setTimeout(function () {
                    hdrPlugin.recordValue(10.5);
                    done();
                }, 1000);
            }

        }


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