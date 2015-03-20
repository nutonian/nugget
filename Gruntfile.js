var _ = require('lodash');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: false,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: false,
                browser: true,
                devel: true,
                jquery: true,
                unused: 'vars',
                globals: {
                    _: true,
                    require: false,
                    define: false,
                    describe: false,
                    expect: false,
                    it: false,
                    beforeEach: false,
                    afterEach: false,
                    afterAll: false,
                    waitsFor: false,
                    runs: false,
                    spyOn: false,
                    jasmine: false
                }
            },
            all: {
                src: [
                    '<%= dirs.js %>/**/*.js',
                    '<%= dirs.tests %>/**/*.js',
                    '!<%= dirs.js %>/libs/**/*.js',
                    '!<%= dirs.js %>/require.js',
                    '!<%= dirs.js %>/templates/templates.js',
                    '!<%= dirs.js %>/app.min.js'
                ]
            }
        },
        watch: {
            javascript: {
                files: '<%= jshint.all.src %>',
                tasks: ['jshint']
            },
            handlebars: {
                files: ['<%= dirs.templates %>/**/*.{hbs,svg}'],
                tasks: ['handlebars']
            },
            sass: {
                files: '<%= dirs.sass %>/**/*.scss',
                tasks: ['sass', 'generateColorsEnum']
            }
        },
        jasmine: {
            src: [],
            options: {
                specs: '<%= dirs.jasmine %>/specs/**/*.spec.js',
                template: require('grunt-template-jasmine-requirejs')
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-template');
};