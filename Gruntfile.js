/* jshint node: true */
module.exports = function (grunt) {
  'use strict';
  var pkg, vglVersion, templateData;

  pkg = grunt.file.readJSON('package.json');
  vglVersion = pkg.version;
  templateData = {
    VGL_VERSION: vglVersion
  };
  var sources = grunt.file.readJSON('sources.json'),
      src = sources.vgl.prefix,
      files = sources.vgl.files
        .map(function (f) {
          return src + '/' + f;
        });

  grunt.config.init({
    pkg: pkg,

    clean: {
      source: ['dist/src', 'src/version.js'],
      all: ['dist', 'src/version.js']
    },
    concat: {
      dist: {
        src: files,
        dest: 'dist/vgl.concat.js'
      }
    },
    template: {
      version: {
        options: {data: templateData},
        files: {'src/version.js': 'src/version.js.in'}
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

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-umd');

  grunt.registerTask('default', ['template', 'concat', 'umd', 'uglify']);
};
