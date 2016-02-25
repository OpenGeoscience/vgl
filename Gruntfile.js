/* jshint node: true */
module.exports = function (grunt) {
  'use strict';
  var pkg, vglVersion, templateData, port;

  pkg = grunt.file.readJSON('package.json');
  vglVersion = pkg.version;
  port = Number(grunt.option('port') || '30101');
  var sources = grunt.file.readJSON('sources.json'),
      src = sources.vgl.prefix,
      files = sources.vgl.files
        .map(function (f) {
          return src + '/' + f;
        });
  templateData = {
    VGL_VERSION: vglVersion,
    SOURCES_JSON: JSON.stringify(files),
    SOURCES_ROOT: '/',
    BUNDLE_EXT: 'built/vgl.ext.min.js'
  };

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
    copy: {
      vgl: {
        src: files,
        dest: 'dist/',
        filter: 'isFile',
        flatten: false
      }
    },
    express: {
      server: {
        options: {
          port: port,
          server: 'testing/test-runners/server.js',
          bases: ['dist']
        }
      }
    },
    template: {
      version: {
        options: {data: templateData},
        files: {'src/version.js': 'src/version.js.in'}
      },
      loadDev: {
        options: {data: templateData},
        files: {'dist/built/vgl.all.dev.js': 'testing/vgl.all.dev.js.in'}
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
      },
      ext: {
        files: {
          'dist/built/vgl.ext.min.js': [
            'node_modules/gl-matrix/dist/gl-matrix.js',
            'node_modules/jquery/dist/jquery.js'
          ]
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-parallel');
  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-umd');

  grunt.registerTask(
    'serve-test',
    'Serve the content for testing.  This starts on port 30101 by ' +
    'default and does not rebuild sources automatically.',
    function () {
      grunt.config.set('express.server.options.hostname', '0.0.0.0');
      if (!grunt.option('port')) {
        grunt.config.set('express.server.options.port', 30101);
      }
      // make sure express doesn't change the port
      var test_port = grunt.config.get('express.server.options.port');
      grunt.event.on('express:server:started', function () {
        if (grunt.config.get('express.server.options.port') !== test_port) {
          grunt.fail.fatal('Port ' + test_port + ' unavailable.');
        }
      });
      grunt.task.run(['express', 'express-keepalive']);
    }
  );

  grunt.registerTask('default', [
    'template',
    'copy:vgl',
    'concat',
    'umd',
    'uglify'
  ]);
};
