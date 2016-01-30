/**
 * Created by abrahamkiggundu on 28/01/2016.
 */
var java = require("java");

describe('node-hdr-histogram-spec', function () {
    var hdrPlugin;

    beforeEach(function () {
        hdrPlugin = require('../index.js')(36000, 1, 3);
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

        it('save some random values into log files', function(done){
            for(var i=0; i<300000; i++) {
                hdrPlugin.recordValue(Math.floor(Math.random()*2000));
            }

            hdrPlugin.outputPercentileDistribution('example.percentile.log', 10000).then(function(){
                hdrPlugin.outputIntervalHistogram('example.histogram.hlog').then(done);
            });

        })


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