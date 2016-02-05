var fs = require('fs');
var _ = require('ramda');
var buildHelper = require('./build-helper');
var packageJson = require('./package.json');
var mkdirp = require('mkdirp');

mkdirp.sync('./dist');
// Duplicate base css file to prod.
fs.writeFileSync('./dist/base.css', fs.readFileSync('base.css').toString());

// // Generate html files from a template
var template = fs.readFileSync('./template.html').toString();
var bundleNames = _.keys(buildHelper.entry);
bundleNames.map(function (bundleName) {
  var contents = template.replace('{bundleName}', bundleName).replace(/\{basePath\}/gm, '/' + packageJson.name);
  mkdirp.sync('./dist/' + bundleName)
  fs.writeFileSync('./dist/' + bundleName + '/index.html', contents);
});
