var gulp = require('gulp'),
    run = require('gulp-run'),
    browserSync = require('browser-sync').create(),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    usemin = require('gulp-usemin'),
    isparta = require('isparta');

var jshint = require('gulp-jshint'),
    git = require('gulp-git'),
    gitignore = require('gulp-gitignore'),
    runSequence = require('run-sequence'),
    prompt = require('gulp-prompt'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    babel = require('babel-register'),
    child_process = require('child_process');
var exec = child_process.exec,
    spawn = child_process.spawn;

var banner = ['/*!\n',
    ' * SCORE - ES 2016.2\n',
    ' * Copyright 2016 - ' + (new Date()).getFullYear(), '\n',
    ' * Tema usado para base: Bootstrap Material Design\n',
    ' */\n',
    ''
].join('');

var INDEX = 'index.html';
var DIST = 'dist/';

/**
 * Minifica e concatena todos os .js e .css incluidos no index
 */
gulp.task('usemin', function () {
    return gulp.src(INDEX)
        .pipe(usemin({
            js: [uglify({mangle: false}), 'concat'],
            css: [cleanCSS(), 'concat']
        }))
        .on('error', errorHandler)
        .pipe(gulp.dest(DIST));
});

/**
 * Imprime o erro que pode ocorrer em algum pipeline
 */
function errorHandler(error) {
    console.log(error.toString());
    this.emit('end');
}

/**
 * Copia apenas arquivos necessários de bibliotecas externas para a pasta vendor
 */
gulp.task('copy', function () {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'));

    gulp.src(['node_modules/bootstrap-material-design/dist/css/bootstrap-material-design.min.css', 'node_modules/bootstrap-material-design/dist/js/material.min.js', 'node_modules/bootstrap-material-design/dist/js/ripples.min.js', 'node_modules/bootstrap-material-design/dist/css/ripples.min.css'])
        .pipe(gulp.dest('vendor/bootstrap-material-design'));

    gulp.src(['node_modules/font-awesome/**/*', '!node_modules/font-awesome/*.json', '!node_modules/font-awesome/.*'])
        .pipe(gulp.dest('vendor/font-awesome'));

    gulp.src(['node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'));

    gulp.src(['node_modules/angular/angular.min.js'])
        .pipe(gulp.dest('vendor/angular'));

    gulp.src(['node_modules/angular-ui-router/release/angular-ui-router.min.js'])
        .pipe(gulp.dest('vendor/angular-ui-router'));

    gulp.src(['node_modules/angular-animate/angular-animate.min.js'])
        .pipe(gulp.dest('vendor/angular-animate'));

    gulp.src(['node_modules/angular-aria/angular-aria.min.js'])
        .pipe(gulp.dest('vendor/angular-aria'));

    gulp.src(['node_modules/angular-messages/angular-messages.min.js'])
        .pipe(gulp.dest('vendor/angular-messages'));

    gulp.src(['node_modules/angular-sanitize/angular-sanitize.min.js'])
        .pipe(gulp.dest('vendor/angular-sanitize'));

    gulp.src(['node_modules/angular-material/angular-material.min.js', 'node_modules/angular-material/angular-material.min.css'])
        .pipe(gulp.dest('vendor/angular-material'));

    gulp.src(['node_modules/ngstorage/ngStorage.min.js'])
        .pipe(gulp.dest('vendor/ngstorage'));
})

/**
 * Inicia o servidor do brownsersync
 */
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
})

/**
 * A task de desenvolvimento irá iniciar o server do browserSync. Mudar isso quando começarmos com o backend
 */
gulp.task('dev', ['copy', 'browserSync'], function () {
    gulp.watch('view/*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});

/**
 * Task que faz a verificação de sintaxe no código js.
 */
gulp.task('jshint', function () {
    return gulp.src('./src/main/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', {verbose: true}))
        .pipe(jshint.reporter('fail'));
});

/**
 * Task que a cada mudança nos códigos fontes se existe algum problema
 * de sintaxe.
 */
gulp.task('default', function () {
    gulp.watch('./src/main/js/**/*.js', function () {
        gulp.run('jshint');
    });
});

/**
 * Task que realiza o push, antes executando os testes e
 * o jshint e verificando se o código está ok.
 */
gulp.task('push', function (cb) {
    runSequence(
        ['jshint', 'test'], ['force-push'],
        function (err) {
            if (err) {
                console.log('[ERROR] gulp build task failed', err.message);
                return sair(2)();
            }
            return sair(0)();
        }
    );
});

/**
 * Task que força o push para o repositório.
 */
gulp.task('force-push', function (cb) {
    return git.push('origin', 'master', function (err) {
        if (err) throw err;
        console.log('Push efeituado com sucesso!');
        cb();
    });
});

/**
 * Task que executa os testes e sai ao finalizar ou ocorrer erro.
 * EXTREMAMENTE IMPORTANTE: Certifique-se que o serviço do mongodb está rodando,
 * ou seja, execute o comando {@code sudo service mongodb start}.
 */
gulp.task('test', function () {
    exec('mongo SCORE-TESTDB --eval "db.dropDatabase();"', function (err, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        runTests()
            .on('error', sair(1))
            .on('end', sair(0));
    });
});

/**
 * Task que executa os testes e continua no processo ao finalizar
 * ou ocorrer erro.
 * EXTREMAMENTE IMPORTANTE: Certifique-se que o serviço do mongodb está rodando,
 * ou seja, execute o comando {@code sudo service mongodb start}.
 */
gulp.task('test-continuar', function () {
    exec('mongo SCORE-TESTDB --eval "db.dropDatabase();"', function (err, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        return runTests();
    });
});


function runTests() {
    return gulp.src('./src/test/**/*.test.js', {read: false})
        .pipe(mocha({
            compilers: 'js:babel-core/register.js',
            reporter: 'nyan',
            timeout: 15000,
            bail: true
        }));
}

/**
 * Task para executar cobertura de testes
 */
gulp.task('test-coverage', function (cb) {
    return gulp.src('./src/main/**/*.js')
        .pipe(istanbul({includeAllSources: true, instrumenter: isparta.Instrumenter}))
        .pipe(istanbul.hookRequire())
        .on('end', function (err) {
            var dropDB = spawn('mongo', ['SCORE-TESTDB', '--eval', '"db.dropDatabase();"']);
            dropDB.stdout.on('data', function (data) {
                process.stdout.write(data.toString());
            });

            dropDB.stderr.on('data', function (data) {
                process.stdout.write('stderr: ' + data.toString());
                return sair(2)();
            });

            dropDB.on('exit', function (code) {
                process.stdout.write('child process exited with code ' + code.toString());
                return gulp.src('./src/test/**/*.test.js')
                    .pipe(mocha({reporter: 'nyan', timeout: 15000, bail: true}))
                    .pipe(istanbul.writeReports({
                        dir: './coverage',
                        reporters: ['lcov'],
                        reportOpts: {dir: './coverage'}
                    }))
                    .on('end', function (err) {
                        if (err) cb(err);
						else sair()();
                    });
            });
        });
});

/**
 * Task que monitora os arquivos js e executa os testes para cada
 * modificação.
 */
gulp.task('watch-test', function () {
    gulp.start('test-continuar');
    gulp.watch(['./src/**/*.js'], ['test-continuar']);
});

/**
 * Cria um callback que finaliza o processo com o status passado.
 */
function sair(status) {
    return function () {
        console.log();
        process.exit(status || 0);
    }
}
