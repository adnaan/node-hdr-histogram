/**
 * Created by abrahamkiggundu on 28/01/2016.
 */

var java = require("./js/javaInit").getJavaInstance();


var SingleWriterRecorder = java.import('org.HdrHistogram.SingleWriterRecorder');
var ByteBuffer = java.import('java.nio.ByteBuffer');
var ByteString = java.import("com.google.protobuf.ByteString");
var JSByteBuffer = require("bytebuffer");

var buf = null;

var getByteBuffer =  function(capacity){
    if (buf == null || buf.capacitySync() < capacity) {
        buf = ByteBuffer.allocateSync(capacity);
    }         
    return buf;
}

module.exports = function (lowestTrackableValue, highestTrackableValue, numberOfSignificantValueDigits) {
    var writerRecorder = new SingleWriterRecorder(java.newLong(lowestTrackableValue), java.newLong(highestTrackableValue), numberOfSignificantValueDigits);

    return {
        recordValue: function (value) {    
           return writerRecorder.recordValue(java.newLong(value));
        },
        reset: function () {
            return writerRecorder.reset()
        },
        /**
         * Likely inefficient method if called multiple times. Initially only intended to facilitate tests
         * @returns {*}
         */
        getTotalCount: function () {
            var histogram = writerRecorder.getIntervalHistogramSync();
            console.log(histogram);
            return histogram.getTotalCountSync();
        },

        encode: function () {
            var histogram = writerRecorder.getIntervalHistogramSync()
            var buffer = getByteBuffer(histogram.getNeededByteBufferCapacitySync());
            buffer.clearSync();
            histogram.encodeIntoByteBufferSync(buffer);
            buffer.flip();
            return Buffer.from(buffer.arraySync())
        }
    }
}
;
