var dive = require('dive');
var path = require('path');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var colors = require('colors');

var pluginsPath = path.resolve(__dirname, '../bin/plugins');

dive(pluginsPath, {directories: false, files: true}, function(err, file) {
    if(err) return;

    if(path.basename(file) == 'package.json') {
        var namespace = path.basename(path.dirname(path.dirname(file)));
        var plugin = path.basename(path.dirname(file));
        console.log("Installing dependencies for ".blue + (namespace + '/' + plugin).cyan);
        spawn('npm', ['install'], {
            cwd: path.dirname(file),
            stdio: 'inherit'
        });
    }
});
