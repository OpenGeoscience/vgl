/* jshint node: true */
module.exports = function (grunt) {
  'use strict';
  var sources = grunt.file.readJSON('sources.json'),
      src = sources.vgl.prefix,
      files = sources.vgl.files
        .map(function (f) {
          return src + '/' + f;
        });

  grunt.initConfig({
    concat: {
      dist: {
        src: files,
        dest: 'dist/vgl.concat.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/vgl.min.js': 'dist/vgl.js'
        },
        options: {
          mangle: true,
          ASCIIOnly: true,
          sourceMap: true
        }
      }
    },
    umd: {
      dist: {
        src: 'dist/vgl.concat.js',
        dest: 'dist/vgl.js',
        objectToExport: 'vgl',
        amdModuleId: 'vgl'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-umd');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['concat', 'umd', 'uglify']);
};
