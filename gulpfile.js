var gulp = require('gulp'),
    run = require('gulp-run'),
    browserSync = require('browser-sync').create(),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    usemin = require('gulp-usemin');
var jshint = require('gulp-jshint'),
    git = require('gulp-git'),
    gitignore = require('gulp-gitignore'),
    runSequence = require('run-sequence'),
    prompt = require('gulp-prompt'),
    istanbul = require('gulp-istanbul'),
    child_process = require('child_process'),
    Server = require('karma').Server;
var exec  = child_process.exec,
    spawn = child_process.spawn;

var banner = ['/*!\n',
    ' * SCORE - ES 2016.2\n',
    ' * Copyright 2016 - ' + (new Date()).getFullYear(), '\n',
    ' * Tema usado para base: Bootstrap Material Design\n',
    ' */\n',
    ''
].join('');

/**
 * Task que realiza o push, antes executando os testes e
 * o jshint e verificando se o código está ok.
 */
gulp.task('push', function (cb) {
    var pushClient = spawn('gulp', ['--gulpfile', './client/gulpfile.js', 'test', '--color']);
    pushClient.stdout.on('data', function (data) {
        process.stdout.write(data.toString());
    });

    pushClient.stderr.on('data', function (data) {
        process.stdout.write('stderr: ' + data.toString());
        return sair(2)();
    });

    pushClient.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
        if (code == 1) {
            console.error('Os testes falharam. Conserte-os para poder dar push!');
            return sair(1)();
        } else {
            console.log('Certifique-se que o serviço do mongo está rodando!');
            console.log('(comando para ativar o serviço: sudo service mongodb start)');
            var pushServer = spawn('gulp', ['--gulpfile', './server/gulpfile.js', 'push', '--color']);

            pushServer.stdout.on('data', function (data) {
                process.stdout.write(data.toString());
            });

            pushServer.stderr.on('data', function (data) {
                process.stdout.write('stderr: ' + data.toString());
                return sair(1)();
            });

            pushServer.on('exit', function (code) {
                console.log();
                console.log('child process exited with code ' + code.toString());
                if (code == 1) {
                    console.error('Os testes falharam. Conserte-os para poder dar push!');
                    return sair(1)();
                }
                return sair(0)();
            });
        }
    });
});

/**
 * Task que adiciona as modificações para commit e realiza
 * o commit.
 */
gulp.task('commit', function (cb) {
    return gulp.src(['./*', '!node_modules/', '!coverage/'])
        .pipe(gitignore())
        .pipe(git.add())
        .pipe(prompt.prompt({
            type: 'input',
            name: 'commit',
            message: 'Insira a mensagem de commit...'
        }, function (res) {
            return gulp.src(['!node_modules/', '!coverage/', '!yarn.*', '!yarn-error.*', './*'], { buffer: false })
                .pipe(git.commit(res.commit));
        }));
});

/**
 * Cria um callback que finaliza o processo com o status passado.
 */
function sair(status) {
    return function () {
        process.exit(status || 0);
    };
}