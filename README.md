# node-hdr-histogram
A port of HDR Histogram at http://hdrhistogram.github.io/HdrHistogram for use with node

##Build
- Ensure that JAVA_HOME is set to a JDK (not JRE) and that JDK is set up to support JNI. [see
here](https://github.com/joeferner/node-java/issues/90#issuecomment-45613235) for details
- Run `npm install`

##Test
- Run `npm test`

##Use example
Run `npm install node-hdr-histogram`
require('node-hdr-histogram-spec')(36000000, 2);
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
