/**
 * Created by abrahamkiggundu on 28/01/2016.
 */

var java = require("./javaInit");

var HdrHistogram = java.import('org.HdrHistogram.Histogram');

module.exports = function (highestTrackableValue, numberOfSignificantValueDigits) {
    var histogram = new HdrHistogram(highestTrackableValue, numberOfSignificantValueDigits);
    return {
        recordValue: function(value){
            histogram.recordValue(value);
        },
        reset: function(){
            histogram.reset()
        },
        outputPercentileDistribution: function(filePath, outputValueUnitScalingRatio){
            histogram.outputPercentileDistribution(filepath, outputValueUnitScalingRatio);
        }
    }
};
