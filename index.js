/**
 * Created by abrahamkiggundu on 28/01/2016.
 */

var java = require("./js/javaInit").getJavaInstance();

var HdrHistogram = java.import('org.HdrHistogram.Histogram');
var PrintStream = java.import('java.io.PrintStream');

module.exports = function (highestTrackableValue, numberOfSignificantValueDigits) {
    var histogram = new HdrHistogram(java.newLong(highestTrackableValue), numberOfSignificantValueDigits);

    return {
        recordValue: function(value){
            histogram.recordValueSync(value);
        },
        reset: function(){
            histogram.resetSync()
        },
        outputPercentileDistribution: function(filePath, outputValueUnitScalingRatio){
            histogram.outputPercentileDistributionSync(new PrintStream(filePath), java.newDouble(outputValueUnitScalingRatio));
        },
        getTotalCount: function(){
            return histogram.getTotalCountSync();
        }
    }
};
