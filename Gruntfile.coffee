module.exports = (grunt) ->
    # Project configuration.
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        notify:
            coffee:
                options:
                    title: 'grunt'
                    message: 'Compiled coffeescript'

        watch:
            coffee:
                files: './**/*.coffee',
                tasks: ['coffee:compile', 'notify:coffee']

        coffee:
            compile:
                options:
                    bare: true
                    sourceMap: true
                files:
                    'app.js': ['app.coffee']
                    'config/config.development.js': ['config/config.development.coffee']
                    'config/config.global.js': ['config/config.global.coffee']
                    'config/config.local.js': ['config/config.local.coffee']
                    'config/config.production.js': ['config/config.production.coffee']
                    'config/index.js': ['config/index.coffee']
                    'lib/db.js': ['lib/db.coffee']
                    'lib/dispatcher.js': ['lib/dispatcher.coffee']
                    'lib/errorhandling.js': ['lib/errorhandling.coffee']
                    'models/Pic.js': ['models/Pic.coffee']
                    'pics/index.js': ['pics/index.coffee']
                    'pics/PicCache.js': ['pics/PicCache.coffee']

            glob_to_multiple: {
                expand: true,
                flatten: true,
                sourceMap: true
                cwd: '',
                src: ['./**/*.coffee'],
                dest: '',
                ext: '.js'
            }

    grunt.loadNpmTasks "grunt-contrib-watch"
    grunt.loadNpmTasks "grunt-iced-coffee"
    grunt.loadNpmTasks 'grunt-notify'

    grunt.registerTask 'default', ['watch']
    grunt.registerTask "release", [
        "coffee"
    ]