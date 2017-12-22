'use strict';

var through = require('through2');
var cssPurge = require('css-purge');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-css-purge';

var gulpCSSPurge = function(options) {
  // console.log('options: ', options);

  function purgedStream(modifiedCSS) {

    return through().write(modifiedCSS);
  }

  return through.obj(function(file, encoding, callback){

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {

      cssPurge.purgeCSS(fileContents, options, function(error, results){

        if (error) {
          return cb(new gutil.PluginError(PLUGIN_NAME, error));
        }

        file.contents = file.contents.pipe(purgedStream(results));
        callback(null, file);
      });


    } else if (file.isBuffer()) {


      var fileContents = file.contents.toString();
      if (!fileContents.length) {
        // Don't crash on empty files
        return callback(null, file);
      }

      //default options
      if (options === null || options === undefined) {
        options = {
          trim : true,
          shorten : true
        };
      }

      try {
        cssPurge.purgeCSS(fileContents, options, function(error, results){

          if (error) {
            return cb(new gutil.PluginError(PLUGIN_NAME, error));
          }

          file.contents = new Buffer(results);
          callback(null, file);
        });
      } catch (error) {
        return cb(new gutil.PluginError(PLUGIN_NAME, error));
      }
    }

  });
};

module.exports = gulpCSSPurge;