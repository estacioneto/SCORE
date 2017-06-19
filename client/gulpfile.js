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
    exec = require('child_process').exec,
    Server = require('karma').Server;

var minifyHtml = require('gulp-minify-html');
var rev = require('gulp-rev');

var banner = ['/*!\n',
    ' * PITON - ES 2016.2\n',
    ' * Copyright 2016 - ' + (new Date()).getFullYear(), '\n',
    ' * Tema usado para base: Bootstrap Material Design\n',
    ' */\n',
    ''
].join('');

var INDEX = './src/**/*.html';
var DIST = 'dist';

/**
 * Minifica e concatena todos os .js e .css incluidos no index
 */
gulp.task('usemin', function () {
    return gulp.src('./src/main/index.html')
        .pipe(usemin({
            css: [rev(), 'concat'],
            html: [minifyHtml({ collapseWhitespace: true }), 'concat'],
            js: [uglify(), rev(), 'concat']
        }))
        .pipe(gulp.dest('dist/'));
});

/**
 * Imprime o erro que pode ocorrer em algum pipeline
 */
function errorHandler(error) {
    console.log(error.toString());
    this.emit('end');
}

var node_modules = '../node_modules/';

var extsJs = [
    "lodash/lodash.min.js",
    "angular/angular.min.js",
    "angular-animate/angular-animate.min.js",
    "angular-aria/angular-aria.min.js",
    "angular-touch/angular-touch.min.js",
    "angular-storage/dist/angular-storage.min.js",
    "angular-ui-router/release/angular-ui-router.js",
    "angular-material/angular-material.min.js",
    "jquery/dist/jquery.min.js",
    "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
    "bootstrap/dist/js/bootstrap.min.js",
    "adm-dtp/dist/ADM-dateTimePicker.min.js",
    "auth0-angular/build/auth0-angular.min.js",
    "angular-lock/dist/angular-lock.min.js",
    "angular-jwt/dist/angular-jwt.min.js"
];

var extsCss = [
    "bootstrap/dist/css/bootstrap.min.css",
    "bootstrap-material-design/dist/css/bootstrap-material-design.min.css",
    "bootstrap-material-design/dist/css/ripples.min.css",
    "angular-material/angular-material.min.css",
    "adm-dtp/dist/ADM-dateTimePicker.min.css",
    "font-awesome/css/font-awesome.min.css"
];

var fonts = [
    "font-awesome/fonts/fontawesome-webfont.woff",
    "font-awesome/fonts/fontawesome-webfont.woff2",
    "font-awesome/fonts/fontawesome-webfont.ttf"
]

/**
 * Copia apenas arquivos necessários de bibliotecas externas para a pasta vendor
 */
gulp.task('copy', function () {
    gulp.src(['../node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'));

    var vendorJsPath = 'vendor/js/';
    var vendorCssPath = 'vendor/css/';
    var vendorFontsPath = 'vendor/css/fonts';

    copyToVendor(extsJs, vendorJsPath);
    copyToVendor(extsCss, vendorCssPath);
    copyToVendor(fonts, vendorFontsPath, true);
});

function copyToVendor(arquivos, path, isFont) {
    for (var i = 0; i < arquivos.length; i++) {
        var scriptPath = node_modules + arquivos[i];
        var scriptPathParts = scriptPath.split('/');
        var scriptNameParts = scriptPathParts[scriptPathParts.length - 1].split('.');
        var finalOutputPath = path;
        if (!isFont) {
            finalOutputPath += scriptNameParts[0];
        }
        gulp.src(scriptPath)
            .pipe(gulp.dest(finalOutputPath));
    }
}

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
        .pipe(jshint.reporter('default', { verbose: true }))
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
 * o jshint e verificando se o código está todo ok.
 */
gulp.task('push', function (cb) {
    runSequence(
        ['jshint', 'test'], ['force-push'],
        function (err) {
            if (err) {
                console.log('[ERROR] gulp build task failed', err.message);
                return sair(1)();
            }
            else {
                return sair(0)();
            }
        }
    );
});

/**
 * Task que força o push para o repositório.
 */
gulp.task('force-push', function (cb) {
    return git.push('origin', 'master', function (err) {
        if (err) throw err;
        else cb();
    });
});

/**
 * Task que executa os testes e sai ao finalizar ou ocorrer erro.
 */
gulp.task('test', function (done) {
    return new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

/**
 * Task para executar cobertura de testes
 */
gulp.task('test-coverage', function (cb) {
    return gulp.src('./src/main/**/*.js')
        .pipe(istanbul({ includeAllSources: true }))
        .pipe(istanbul.hookRequire())
        .on('end', function (err) {
            return gulp.src('./src/test/**/*.test.js')
                .pipe(mocha({ reporter: 'nyan', timeout: 15000, bail: true }))
                .pipe(istanbul.writeReports({
                    dir: './coverage',
                    reporters: ['lcov'],
                    reportOpts: { dir: './coverage' }
                }))
                .on('end', function (err) {
                    if (err) cb(err);
                    exec("google-chrome coverage/lcov-report/index.html", function (err) {
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
gulp.task('watch-test', function (done) {
    return new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false
    }, done).start();
});

/**
 * Cria um callback que finaliza o processo com o status passado.
 */
function sair(status) {
    return function () {
        process.exit(status || 0);
    }
}