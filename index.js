/**
 * Created by abrahamkiggundu on 28/01/2016.
 */

var java = require("./js/javaInit").getJavaInstance();

var HdrHistogram = java.import('org.HdrHistogram.Histogram');

module.exports = function (highestTrackableValue, numberOfSignificantValueDigits) {
    var histogram = new HdrHistogram(highestTrackableValue, numberOfSignificantValueDigits);

    return {
        recordValue: function(value){
            histogram.recordValueSync(value);
        },
        reset: function(){
            histogram.resetSync()
        },
        outputPercentileDistribution: function(filePath, outputValueUnitScalingRatio){
            histogram.outputPercentileDistributionSync(filepath, outputValueUnitScalingRatio);
        },
        getTotalCount: function(){
            return histogram.getTotalCountSync();
        }
    }
};
