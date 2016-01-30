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
var HdrHistogramLogWriter = java.import('org.HdrHistogram.HistogramLogWriter');
var SingleWriterRecorder = java.import('org.HdrHistogram.SingleWriterRecorder');
var PrintStream = java.import('java.io.PrintStream');

module.exports = function (highestTrackableValue, lowestTrackableValue, numberOfSignificantValueDigits, filePath) {
    var histogram = new HdrHistogram(java.newLong(highestTrackableValue), numberOfSignificantValueDigits);
    var writerRecorder = new SingleWriterRecorder(java.newLong(lowestTrackableValue), java.newLong(highestTrackableValue), numberOfSignificantValueDigits);
    var reportingStartTime = new Date().getTime();

    var histogramLogWriter = new HdrHistogramLogWriter(new PrintStream(filePath));

    var getVersionString = function () {
        var pjson = require('./package.json');
        return pjson.name + ':' + pjson.version;
    };
    return {
        recordValue: function (value) {
            var ret = writerRecorder.recordValuePromise(java.newLong(value));
            return ret.then(function () {
                var reportingEndTime = new Date().getTime();

                var histogram = writerRecorder.getIntervalHistogram();
                histogram.setStartTimeStamp(java.newLong(reportingStartTime / 1000));
                histogram.setEndTimeStamp(java.newLong(reportingEndTime / 1000));
                return histogramLogWriter.outputIntervalHistogram(reportingStartTime / 1000, reportingEndTime / 1000, histogram);
            });
        },
        reset: function () {
            reportingStartTime = new Date().getMilliseconds();
            histogramLogWriter.outputComment("[Logged with " + getVersionString() + "]");
            histogramLogWriter.outputLogFormatVersion();
            histogramLogWriter.outputStartTime(java.newLong(reportingStartTime / 1000));
            histogramLogWriter.setBaseTime(java.newLong(reportingStartTime / 1000));
            histogramLogWriter.outputLegend();
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
                histogramLogWriter.outputStartTime(java.newLong(reportingStartTime / 1000));
                histogramLogWriter.setBaseTime(java.newLong(reportingStartTime / 1000));
                histogramLogWriter.outputLegend();

                var histogram = writerRecorder.getIntervalHistogram();
                histogram.setStartTimeStamp(java.newLong(reportingStartTime / 1000));
                histogram.setEndTimeStamp(java.newLong(reportingEndTime / 1000));
                return histogramLogWriter.outputIntervalHistogram(reportingStartTime / 1000, reportingEndTime / 1000, histogram);

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
