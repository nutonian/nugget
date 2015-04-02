module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-template-jasmine-requirejs']
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        dirs: {
            examples : 'example/**/*.js',
            lib      : 'lib/',
            build    : 'build/',
            release  : 'release/',
            test     : 'test/',
            nuggetJS : [
                'Gruntfile.js',
                '<%= dirs.lib %>/**/*.js',
                '<%= dirs.test %>/**/*.js'
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
                    'cwd'    : '<%= dirs.lib %>',
                    'src'    : ['**/*.js'],
                    'dest'   : '<%= dirs.build %>'
                }]
            }
        },

        clean: {
            build: ['build'],
            release: ['release']
        },

        connect: {
            server: {
                options: {
                    base: '.',
                    hostname: '*',
                    port: 9999
                }
            }
        },

        jasmine: {
            taskName: {
                src: '<%= dirs.release %>/Nugget.js',
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

        requirejs: {
            compile: {
                options: {
                    name: 'Nugget',
                    baseUrl: '<%= dirs.build %>',
                    optimize: 'none',
                    out: '<%= dirs.release %>/Nugget.js',
                    wrap: {
                        start: '// Nugget version <%= pkg.version %> by Nutonian Inc.\n\n',
                    }
                }
            }
        },

        watch: {
            javascript: {
                files: '<%= dirs.nuggetJS %>',
                tasks: ['clean:build', 'babel', 'jshint'],
                options: {
                    atBegin: true
                }
            }
        }
    });

    grunt.registerTask('build', ['jshint', 'clean', 'babel', 'requirejs']);
    grunt.registerTask('development', ['build', 'connect', 'watch']);
    grunt.registerTask('default', ['build']);

};
