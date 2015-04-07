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
                '<%= dirs.test %>/**/*.spec.js'
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
            dist: {
                src: '<%= dirs.build %>/Nugget.js',
                options: {
                    specs: '<%= dirs.test %>/**/*.spec.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: 'build/'
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
                tasks: ['clean:build', 'babel', 'addPolyfill', 'jshint'],
                options: {
                    atBegin: true
                }
            }
        }
    });

    grunt.registerTask('addPolyfill', function() {
        var fs = require('fs');
        var polyfillPath = './node_modules/grunt-babel/node_modules/babel-core/browser-polyfill.js';
        var polyfill = '\r' + fs.readFileSync(polyfillPath, {encoding: 'utf8'});
        fs.appendFileSync('./build/Nugget.js', polyfill, {encoding: 'utf8'});
    });

    grunt.registerTask('development', ['build', 'connect', 'watch']);
    grunt.registerTask('tests',       ['jasmine:dist:build']);
    grunt.registerTask('build',       ['jshint', 'clean', 'babel', 'addPolyfill', 'requirejs']);
    grunt.registerTask('default',     ['build']);

};
