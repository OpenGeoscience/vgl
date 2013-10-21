/**
 * Copyright 2013 Kitware Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = function (grunt) {
  var fs = require('fs');
  var path = require('path');
  var DEBUG = false;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['src/*.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    uglify: {
      options: {
        beautify: false
      },
      dist: {
        src: ['src/*.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/*.js']
    },
    clean: ["dist"],
    copy: {
      pkg: {
        src: 'package.json',
        dest: 'dist/package.json'
      },
      readme: {
        src: 'README.md',
        dest: 'dist/README.md'
      }
    },
    shell: {
      dist: {
        command: 'npm publish dist',
        options: {
          stdout: true
        }
      }
    },
    release: {
      options: {
        npm: false,
        folder: 'dist'
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask('default', ['clean', 'concat', 'uglify', 'copy']);
  grunt.registerTask('dist', ['release', 'default', 'shell:dist']);
};
