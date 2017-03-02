module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-template-jasmine-requirejs']
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        dirs: {
            examples     : 'example/**/*.js',
            lib          : 'lib',
            build        : 'build',
            dependencies : 'dependencies',
            test         : 'test',
            wrappers     : 'wrappers',
            nuggetJS : [
                'Gruntfile.js',
                '<%= dirs.lib %>/**/*.js',
                '<%= dirs.test %>/**/*.spec.js'
            ]
        },

        clean: ['build', '_SpecRunner.html'],

        connect: {
            server: {
                options: {
                    base: '.',
                    hostname: '*',
                    port: 9000
                }
            }
        },

        jasmine: {
            dist: {
                src: '<%= dirs.build %>/Nugget.js',
                options: {
                    specs: '<%= dirs.test %>/**/*.spec.js',
                    helpers: '<%= dirs.test %>/helpers/*.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: '<%= dirs.build %>/'
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

        watch: {
            javascript: {
                files: '<%= dirs.nuggetJS %>',
                tasks: ['jshint']
            }
        },

        'saucelabs-jasmine': {
            all: {
                options: {
                    urls         : ['http://localhost:9000/_SpecRunner.html'],
                    tunnelTimeout: 5,
                    concurrency  : 3,
                    build        : process.env.BUILD_NUMBER,
                    browsers     : [{
                        browserName: "chrome",
                        platform: "OS X 10.8"
                    }],
                    testname     : "Nugget tests",
                    tags         : ["master"],
                    sauceConfig: {
                        "screenResolution": "1920x1200"
                    }
                }
            }
        }
    });

    grunt.registerTask('development', ['tests', 'connect', 'watch']);
    grunt.registerTask('tests',       ['jasmine:dist:build']);
    grunt.registerTask('default',     ['development']);
    grunt.registerTask('sauce_tests', ['connect', 'saucelabs-jasmine']);
};
