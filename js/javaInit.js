/**
 * Created by abrahamkiggundu on 28/01/2016.
 */
"use strict";

var java = require("java");
var baseDir = "/Users/13407/code/java/HdrHistogram";
var deps = [ 
  '/Users/13407/.m2/repository/org/hdrhistogram/HdrHistogram/2.1.10-SNAPSHOT/HdrHistogram-2.1.10-SNAPSHOT.jar',
  '/Users/13407/.m2/repository/com/google/protobuf/protobuf-java/3.1.0/protobuf-java-3.1.0.jar'
  ]
module.exports = {
    getJavaInstance: function() {
        deps.forEach(function(dep){
            java.classpath.push(dep);
        })
        return java;
    }
}
