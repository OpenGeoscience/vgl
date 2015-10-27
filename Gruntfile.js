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
    jshint: {
      library: {
        src: files,
        options: {
          jshintrc: '.jshintrc'
        }
      },
      gruntfile: {
        src: ['Gruntfile.js'],
        options: {
          node: true
        }
      }
    },
    jscs: {
      library: {
        src: files
      },
      gruntfile: {
        src: ['Gruntfile.js']
      }
    },
    concat: {
      dist: {
        src: files,
        dest: 'dist/vgl.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/vgl.min.js': files
        },
        options: {
          mangle: true,
          ASCIIOnly: true,
          sourceMap: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['jshint', 'jscs']);
  grunt.registerTask('default', ['concat', 'uglify']);
};
