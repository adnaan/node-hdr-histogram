# node-hdr-histogram
A port of HDR Histogram at http://hdrhistogram.github.io/HdrHistogram for use with node

##Build
- Ensure that JAVA_HOME is set to a JDK (not JRE) and that JDK is set up to support JNI. [see
here](https://github.com/joeferner/node-java/issues/90#issuecomment-45613235) for details
- Run `npm install`

##Test
- Run `npm test`

##To install fro npm registry
Run `npm install hdr-histogram`

##Example nodejs code
    //instantiate the histogram
    var hdr = require('hdr-histogram')(36000000, 2);
    
    //Record a latency value
    hdr.recordValue(200);
    
    //save recordings to file
    hdr.outputPercentileDistribution('test.log', 1000);
    
    //reset recording
    hdr.reset();
