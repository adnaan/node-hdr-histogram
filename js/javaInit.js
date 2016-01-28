/**
 * Created by abrahamkiggundu on 28/01/2016.
 */
"use strict";
var fs = require("fs");
var java = require("java");
var baseDir = "./lib";
var dependencies = fs.readdirSync(baseDir);

dependencies.forEach(function(dependency){
    java.classpath.push(baseDir + "/" + dependency);
})


module.exports = {
    getJavaInstance: function() {
        return java;
    }
}
