# node-hdr-histogram
A port of HDR Histogram at http://hdrhistogram.github.io/HdrHistogram for use with node.
All calls into the Java layer are asynchronous by default to improve performance.

##Build
Run `npm install`
####Solving known OSX java/jni build issues wrt the java node module
Ensure that JAVA_HOME is set to a JDK (not JRE)
 
e.g. `export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.7.0_25.jdk/Contents/Home`

and that the JDK is set up to support JNI (off by default on OSX), 

i.e open `$JAVA_HOME/../Info.plist` and add `JNI` to the `JVMCapabilities` array. 

[see here](https://github.com/joeferner/node-java/issues/90#issuecomment-45613235) for details

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
use the [Visualizer](https://github.com/ennerf/HdrHistogramVisualizer) to load the produced file.
THis allows you to view the max-per-interval plot and the percentile plot without futher processing the log file.

##To generate and view percentile data
Run the following script to process the histogram logs above and produce a percentile series log file
    
    `./HistogramLogProcessor -i <log file outputted above> -o processedLogs`

A **'processedLogs.hgrm'** file is generated. This can be ploted in excell or opened with the online [Dynamic Histogram Plotter](http://hdrhistogram.github.io/HdrHistogram/plotFiles.html) tool which dynamically show your percentiles

enjoy.

