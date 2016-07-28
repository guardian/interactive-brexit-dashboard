var fs = require('fs');

module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({

        visuals: { },

        watch: {
            js: {
                files: ['src/js/**/*'],
                tasks: ['interactive'],
            },
            css: {
                files: ['src/css/**/*'],
                tasks: ['sass', 'cssmin', 'shell:render'],
            },
            assets: {
                files: ['src/assets/**/*'],
                tasks: ['copy:assets']
            },
            harness: {
                files: ['harness/**/*'],
                tasks: ['harness']
            }
        },

        clean: {
            build: ['build']
        },

        sass: {
            options: {
                sourceMap: true
            },
            interactive: {
                files: {
                    'build/main.css': 'src/css/main.scss'
                }
            }
        },

        cssmin: {
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          target: {
            files: {
              'build/main.css': ['build/main.css']
            }
          }
        },

        shell: {
            interactive: {
                command: './node_modules/.bin/jspm bundle-sfx <%= visuals.jspmFlags %> src/js/main build/main.js',
                options: {
                    execOptions: {
                        cwd: '.'
                    }
                }
            },
            render: {
                command: 'babel-node src/js/renderer/render.js'
            }
        },

        'template': {
            'options': {
                'data': {
                    'assetPath': '<%= visuals.assetPath %>',
                    'basePath': '<%= visuals.basePath %>',
                }
            },
            'bootjs': {
                'files': {
                    'build/boot.js': ['src/js/boot.js.tpl'],
                }
            },
            'index': {
                'files': {
                    'build/index.html': ['build/index.html'],
                }
            }
        },

        copy: {
            harness: {
                files: [
                    {expand: true, cwd: 'harness/', src: ['curl.js', 'index.html', 'immersive.html', 'interactive.html'], dest: 'build'},
                ]
            },
            assets: {
                files: [
                    {expand: true, cwd: 'src/', src: ['assets/**/*'], dest: 'build'},
                ]
            },
            deploy: {
                files: [
                    { // BOOT
                        expand: true, cwd: 'build/',
                        src: ['index.html'],
                        dest: 'deploy/<%= visuals.timestamp %>/embed'
                    },
                    { // BOOT
                        expand: true, cwd: 'build/',
                        src: ['boot.js'],
                        dest: 'deploy/<%= visuals.timestamp %>'
                    },
                    { // ASSETS
                        expand: true, cwd: 'build/',
                        src: ['assets/**/*', 'main.js', 'main.js.map'],
                        dest: 'deploy/<%= visuals.timestamp %>/<%= visuals.timestamp %>'
                    }
                ]
            }
        },
        prompt: {
            visuals: {
                options: {
                    questions: [
                        {
                            config: 'visuals.s3.stage',
                            type: 'list',
                            message: 'Deploy to TEST or PRODUCTION URL?',
                            choices: [{
                                name: 'TEST: <%= visuals.s3.domain %>testing/<%= visuals.s3.path %>',
                                value: 'TEST'
                            },{
                                name: 'PROD: <%= visuals.s3.domain %><%= visuals.s3.path %>',
                                value: 'PROD'
                            }]
                        },
                        {
                            config: 'visuals.confirmDeploy',
                            type: 'confirm',
                            message: 'Deploying to PRODUCTION. Are you sure?',
                            default: false,
                            when: function(answers) {
                                return answers['visuals.s3.stage'] === 'PROD';
                            }
                        }
                    ],
                    then: function(answers) {
                        if (grunt.config('visuals.s3.stage') !== 'PROD') { // first Q
                            var prodPath = grunt.config('visuals.s3.path');
                            var testPath = 'testing/' + prodPath;
                            grunt.config('visuals.s3.path', testPath);
                        } else if (answers['visuals.confirmDeploy'] !== true) { // second Q
                            grunt.fail.warn('Please confirm to deploy to production.');
                        }
                    }
                }
            },
        },

        aws_s3: {
            options: {
                region: 'us-east-1',
                debug: grunt.option('dry'),
                bucket: '<%= visuals.s3.bucket %>',
                uploadConcurrency: 10, // 5 simultaneous uploads
                downloadConcurrency: 10 // 5 simultaneous downloads
            },
            production: {
                options: {
                },
                files: [
                    { // ASSETS
                        expand: true,
                        cwd: 'deploy/<%= visuals.timestamp %>',
                        src: ['<%= visuals.timestamp %>/**/*'],
                        dest: '<%= visuals.s3.path %>',
                        params: { CacheControl: 'max-age=2678400' }
                    },
                    { // BOOT
                        expand: true,
                        cwd: 'deploy/<%= visuals.timestamp %>',
                        src: ['boot.js'],
                        dest: '<%= visuals.s3.path %>',
                        params: { CacheControl: 'max-age=60' }
                    },
                    { // EMBED
                        expand: true,
                        cwd: 'deploy/<%= visuals.timestamp %>/embed',
                        src: ['index.html'],
                        dest: '<%= visuals.s3.path %>',
                        params: { CacheControl: 'max-age=60' }
                    }
                ]
            }
        },

        connect: {
            server: {
                options: {
                    hostname: '0.0.0.0',
                    port: 8000,
                    base: 'build',
                    middleware: function (connect, options, middlewares) {
                        // inject a custom middleware http://stackoverflow.com/a/24508523
                        middlewares.unshift(function (req, res, next) {
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.setHeader('Access-Control-Allow-Methods', '*');
                            return next();
                        });
                        return middlewares;
                    }
                }
            }
        }
    });

    grunt.registerTask('loadDeployConfig', function() {
        grunt.config('visuals', {
            s3: grunt.file.readJSON('./cfg/s3.json'),
            timestamp: Date.now(),
            jspmFlags: '-m',
            assetPath: '<%= visuals.s3.domain %><%= visuals.s3.path %>/<%= visuals.timestamp %>',
            basePath: '<%= visuals.s3.domain %><%= visuals.s3.path %>'
        });
    })

    grunt.registerTask('boot_url', function() {
        grunt.log.write('\nURL: '['yellow'].bold)
        grunt.log.writeln(grunt.template.process('<%= visuals.s3.domain %><%= visuals.s3.path %>/embed/index.html'))

        grunt.log.write('\nBOOT: '['yellow'].bold)
        grunt.log.writeln(grunt.template.process('<%= visuals.s3.domain %><%= visuals.s3.path %>/boot.js'))
    })

    grunt.registerTask('interactive', ['shell:interactive', 'sass:interactive', 'cssmin', 'shell:render', 'template:index']);
    grunt.registerTask('all', ['interactive', 'copy:assets'])
    grunt.registerTask('default', ['clean', 'all', 'connect', 'watch']);
    grunt.registerTask('build', ['clean', 'all']);

    grunt.registerTask('render', ['interactive', 'shell:render']);

    grunt.registerTask('deploy', ['loadDeployConfig', 'prompt:visuals', 'build', 'template:bootjs', 'copy:deploy', 'aws_s3', 'boot_url']);

    grunt.loadNpmTasks('grunt-aws');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
}
