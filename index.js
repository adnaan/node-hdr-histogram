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
var SingleWriterRecorder = java.import('org.HdrHistogram.SingleWriterRecorder');
var PrintStream = java.import('java.io.PrintStream');

module.exports = function (highestTrackableValue, lowestTrackableValue, numberOfSignificantValueDigits) {
    var histogram = new HdrHistogram(java.newLong(highestTrackableValue), numberOfSignificantValueDigits);
    var writerRecorder = new SingleWriterRecorder(java.newLong(lowestTrackableValue), java.newLong(highestTrackableValue), numberOfSignificantValueDigits);
    var date = new Date();
    var reportingStartTime = new Date().getTime();

    var getVersionString = function () {
        var pjson = require('./package.json');
        return pjson.name + ':' + pjson.version;
    };

    return {
        recordValue: function (value) {
            var ret = writerRecorder.recordValueWithExpectedIntervalPromise(value, java.newLong(1.0 * 1000 * 1000)/*nanoseconds of resolution*/);
            return ret;
        },
        reset: function () {
            reportingStartTime = new Date().getMilliseconds();
            return writerRecorder.resetPromise()
        },
        outputPercentileDistribution: function (filePath, outputValueUnitScalingRatio) {
            var ret = histogram.outputPercentileDistributionPromise(new PrintStream(filePath), java.newDouble(outputValueUnitScalingRatio));

            return ret;
        },
        outputIntervalHistogram: function (filePath) {
            var ret = java.newInstancePromise('org.HdrHistogram.HistogramLogWriter', new PrintStream(filePath)).then(function (histogramLogWriter) {
                var reportingEndTime = new Date().getTime();
                histogramLogWriter.outputComment("[Logged with " + getVersionString() + "]");
                histogramLogWriter.outputLogFormatVersion();
                histogramLogWriter.outputStartTime(java.newLong(reportingStartTime/1000));
                histogramLogWriter.setBaseTime(java.newLong(reportingStartTime));
                histogramLogWriter.outputLegend();

                var histogram = writerRecorder.getIntervalHistogram();
                histogram.setStartTimeStamp(java.newLong(reportingStartTime));
                histogram.setEndTimeStamp(java.newLong(reportingEndTime));
                return histogramLogWriter.outputIntervalHistogram(reportingStartTime/1000, reportingEndTime/1000, histogram);

            });

            return ret;
        },
        /**
         * Likely inefficient method if called multiple times. Initially only intended to facilitate tests
         * @returns {*}
         */
        getTotalCount: function () {
            var ret = writerRecorder.getIntervalHistogramPromise().then(function (histogram) {
                return histogram.getTotalCountPromise();
            });
            return ret;
        }
    }
};
