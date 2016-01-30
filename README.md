# node-hdr-histogram
A port of HDR Histogram at http://hdrhistogram.github.io/HdrHistogram for use with node.
All calls into the Java layer are asynchronous by default to improve performance.

##Build
- Ensure that JAVA_HOME is set to a JDK (not JRE) and that JDK is set up to support JNI. [see
here](https://github.com/joeferner/node-java/issues/90#issuecomment-45613235) for details
- Run `npm install`

##Test
- Run `npm test`

##To install from npm registry
Run `npm install hdr-histogram`

##Example nodejs code
    //instantiate the hdr-histogram module with
    //- max value you expect to record
    //- min value you expect to record (must be greater than 1 so scale your recorded values appropriately)
    //- significant digits to record (precision)
    //- the log file to write to
    var hdr = require('hdr-histogram')(2000000, 1, 5, 'example.histogram.hlog');
    
    //Record a latency value
    hdr.recordValue(200); //this
    
    //reset the recording process
    hdr.reset();

    All the above calls also return promises so that rather than fire-and-forget the caller can use the return value to determine when the call was completed
    
    
##To view the recorded results
use the [Visualizer](https://github.com/ennerf/HdrHistogramVisualizer) to load the produced file and view your intervals and performance trends

##To generate and view interactive percentile data
Use the [Histogram log processor](https://github.com/HdrHistogram/HdrHistogram/blob/master/HistogramLogProcessor) script as below
    
    `./HistogramLogProcessor -i <log file outputted above> -o processedLogs`
Then open *'processedLogs.hgrm'* file generated with the online [Dynamic Histogram Plotter](http://hdrhistogram.github.io/HdrHistogram/plotFiles.html) tool to dynamically show your percentiles

enjoy.

