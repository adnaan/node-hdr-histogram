/**
 * Created by abrahamkiggundu on 28/01/2016.
 */

var java = require("./js/javaInit").getJavaInstance();

java.asyncOptions = {
    asyncSuffix: undefined,     // Don't generate node-style methods taking callbacks
    syncSuffix: "",              // Sync methods use the base name(!!)
    promiseSuffix: "Promise",   // Generate methods returning promises, using the suffix Promise.
    promisify: require('when/node').lift
};

var HdrHistogram = java.import('org.HdrHistogram.Histogram');
var PrintStream = java.import('java.io.PrintStream');

module.exports = function (highestTrackableValue, numberOfSignificantValueDigits) {
    var histogram = new HdrHistogram(java.newLong(highestTrackableValue), numberOfSignificantValueDigits);

    return {
        recordValue: function (value) {
            var ret = histogram.recordValuePromise(value);
            return ret;
        },
        reset: function () {
            return histogram.resetPromise()
        },
        outputPercentileDistribution: function (filePath, outputValueUnitScalingRatio) {
            return histogram.outputPercentileDistributionPromise(new PrintStream(filePath), java.newDouble(outputValueUnitScalingRatio));
        },
        getTotalCount: function () {
            var ret = histogram.getTotalCountPromise();
            return ret;
        }
    }
};
