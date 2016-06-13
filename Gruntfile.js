module.exports = function (grunt) {
  grunt.initConfig({
    mochaTest: {
      test: {
        src: ['tests/**/*.js'],
      },
    },
    webpack: {
      build: {
        entry: './app/app.js',
        output: {
          path: 'public',
          filename: 'build.js'
        }
      }
    },
    execute: {
      target: {
        src: ['server.js']
      }
    },
    copy: {
      dist: {
        files: [
          {src: 'node_modules/bootstrap/dist/css/bootstrap.min.css', dest: 'public/bootstrap.min.css'}
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['webpack:build', 'copy:dist','execute']);
  grunt.registerTask('build', ['webpack:build', 'copy:dist']);
  grunt.registerTask('serve', ['webpack:build', 'copy:dist','execute']);
  grunt.registerTask('test', ['webpack:build', 'copy:dist', 'mochaTest']);
};