module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-template-jasmine-requirejs']
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        dirs: {
            lib      : 'lib/**/*.js',
            test     : 'test/',
            examples : 'example/**/*.js',
            nuggetJS : [
                'Gruntfile.js',
                '<%= dirs.lib %>',
                '<%= dirs.test %>'
            ]
        },

        babel: {
            options: {
                sourceMap: true,
                modules: 'umd'
            },
            dist: {
                files: [{
                    'expand' : true,
                    'cwd'    : 'lib/',
                    'src'    : ['**/*.js'],
                    'dest'   : 'release/'
                }]
            }
        },

        clean: ['release'],

        connect: {
            server: {
                options: {
                    base: '.',
                    hostname: '*',
                    port: 9999,
                    keepalive: true
                }
            }
        },

        jasmine: {
            taskName: {
                src: 'release/Nugget.js',
                options: {
                    specs: '<%= dirs.test %>/*.spec.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: 'release/'
                        }
                    }
                }
            }
        },

        jshint: {
            all: '<%= dirs.nuggetJS %>',
            options: {
                jshintrc: '.jshintrc'
            }
        },

        /*
            Note: Requirejs release stuff is currently busted
         */
        requirejs: {
            compile: {
                options: {
                    name: 'Nugget',
                    baseUrl: 'release/',
                    optimize: 'none',
                    out: 'release/Nugget.release.js'
                }
            }
        },

        watch: {
            javascript: {
                files: '<%= dirs.nuggetJS %>',
                tasks: ['clean', 'babel', 'jshint']
            }
        }
    });

    grunt.registerTask('default', ['jshint', 'clean', 'babel', /*'requirejs'*/]);

};
