module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['lib/**/*.js', 'test/**/*.js', 'example/**/*.js', '!lib/dependencies/*.js'],
            options: {
                esnext: true,
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
                unused: 'vars'
            }
        },
        watch: {
            javascript: {
                files: ['lib/**/*.js', 'test/**/*.js', 'example/**/*.js'],
                tasks: ['jshint']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint']);
};