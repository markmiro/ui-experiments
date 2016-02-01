var fs = require('fs');
var _ = require('ramda');
var buildHelper = require('./build-helper');

// Generate dist dir in case it doesn't exist
var dir = './dist';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Duplicate base css file to prod.
fs.writeFileSync('./dist/base.css', fs.readFileSync('base.css').toString());

// // Generate html files from a template
var template = fs.readFileSync('./template.html').toString();
var bundleNames = _.keys(buildHelper.entry);
bundleNames.map(function (bundleName) {
  var contents = template.replace('{bundleName}', bundleName);
  fs.writeFileSync('./dist/' + bundleName + '.html', contents);
});
