'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        nodeunit: {
            files: ['test/**/*_test.js']
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['routes/**/*.js', 'public/controllers/*.js']
            },
            test: {
                src: ['test/*_test.js']
            }
        },
        uglify: {
            minjs: {
                src: 'public/js/controllers/*.js',
                dest: 'public/js/controller.min.js',
                options: {
                    mangle: false
                }
            },
          beautify:{
             src: 'public/js/app.js',
             dest: 'public/js/app.js',
             options: {
               mangle: false,
               beautify:true,
               compress:false
                }
          }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib', 'nodeunit']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'nodeunit']
            },
            js: {
                files: 'public/js/controllers/*.js',
                tasks: ['uglify:minjs']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task.
    grunt.registerTask('default', ['jshint', 'nodeunit']);
    grunt.registerTask('test', ['jshint:test', 'nodeunit']);
    // uglify task
    grunt.registerTask('minJS', ['uglify:minjs']);
    grunt.registerTask('btfJS', ['uglify:beautify']);
    grunt.registerTask('watchJS', ['watch:js']);

};