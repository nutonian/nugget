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
            release      : 'release',
            test         : 'test',
            wrappers     : 'wrappers',
            nuggetJS : [
                'Gruntfile.js',
                '<%= dirs.lib %>/**/*.js',
                '<%= dirs.test %>/**/*.spec.js'
            ]
        },

        babel: {
            options: {
                sourceMap: true,
                presets: [
                    ['es2015', { modules: 'amd' }]
                ],
                plugins: [
                    'add-module-exports'
                ]
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
                    baseUrl: '.',
                    name: '<%= dirs.dependencies %>/almond',
                    include: ['<%= dirs.build %>/Nugget'],
                    optimize: 'uglify2',
                    // Mainly using uglify to strip out comments/source maps
                    uglify2: {
                        output: {
                            beautify: true
                        },
                        warnings: false,
                        mangle: false
                    },
                    out: '<%= dirs.release %>/Nugget.js',
                    wrap: {
                        startFile: 'wrappers/start.frag.js',
                        endFile: 'wrappers/end.frag.js'
                    }
                }
            }
        },

        watch: {
            lib: {
                files: '<%= dirs.lib %>/**/*.js',
                tasks: ['clean:build', 'babel', 'addPolyfill', 'requirejs'],
                options: {
                    atBegin: true
                }
            },
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
                        platform: "macOS 10.12"
                    }],
                    testname     : "Nugget tests",
                    tags         : ["master"],
                    sauceConfig: {
                        "screenResolution": "1920x1440"
                    }
                }
            }
        }
    });

    grunt.registerTask('addPolyfill', function() {
        var fs = require('fs');
        var polyfillPath = './node_modules/babel-polyfill/dist/polyfill.js';
        var polyfill = '\r' + fs.readFileSync(polyfillPath, {encoding: 'utf8'});
        fs.appendFileSync('./build/Nugget.js', polyfill, {encoding: 'utf8'});
    });

    grunt.registerTask('development', ['build', 'tests', 'connect', 'watch']);
    grunt.registerTask('tests',       ['jasmine:dist:build']);
    grunt.registerTask('build',       ['jshint', 'clean', 'babel', 'addPolyfill', 'requirejs']);
    grunt.registerTask('default',     ['build']);
    grunt.registerTask('sauce_tests', ['connect', 'saucelabs-jasmine']);
};
