
var angularFilesort     = require('gulp-angular-filesort'),
    clean               = require('gulp-clean'),
    concat              = require('gulp-concat'),
    connect             = require('gulp-connect'),
    gulp                = require('gulp'),
    gulpif              = require('gulp-if'),
    historyApiFallback  = require('connect-history-api-fallback'),
    inject              = require('gulp-inject'),
    jshint              = require('gulp-jshint'),
    minifyCss           = require('gulp-minify-css'),
    runSequence         = require('run-sequence'),
    templateCache       = require('gulp-angular-templatecache'),
    uglify              = require('gulp-uglify'),
    useref              = require('gulp-useref'),
    wiredep             = require('wiredep').stream;

//Lanza un servidor
gulp.task('connect', function() {
    connect.server({
        root: './app',
        hostname: '127.0.0.1',
        port: 4000,
        livereload: true
    });
});

//Lanza un servidor desde build (aplicación minimiazada)
gulp.task('connect-build', function() {
    connect.server({
        root: './dist',
        hostname: '127.0.0.1',
        port: 4000,
        livereload: true,
    });
});

//Minimiza el javascript en un fichero app.min.js y lo almacena en build
gulp.task('js', function(){
    return gulp.src(['app/js/*.js', 'app/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('dist'));
});

// Compila las plantillas HTML parciales a JavaScript
// para ser inyectadas por AngularJS y minificar el código
gulp.task('templates', function(){
    gulp.src(['app/views/*.html'])
        .pipe(templateCache({
            filename: 'mainTemplates.js',
            root: '/app/views/',
            module: 'appglass.mainTemplates',
            standalone: true
        }))
        .pipe(gulp.dest('app/js'));
    gulp.src(['app/modules/**/*.html'])
        .pipe(templateCache({
            filename: 'modulesTemplates.js',
            root: 'modules/',
            module: 'appglass.modulesTemplates',
            standalone: true
        }))
        .pipe(gulp.dest('app/js'));
});

// Busca en las carpetas de estilos y javascript los archivos
// para inyectarlos en el index.html
gulp.task('inject', function() {

  var target = gulp.src('app/index.html');

  var sources = gulp.src(['app/js/**/*.js', 'app/css/*.css', 'app/lib/bootstrap/dist/css/bootstrap.css'], {read: false});

  return target.pipe(inject(sources, {ignorePath: 'app'}))
      .pipe(gulp.dest('app'));

});


gulp.task('inject-modules', function() {

    return gulp.src('index.html', {cwd: 'app'})
                .pipe(inject(gulp.src(['app/modules/**/*.js'])
                                .pipe(angularFilesort()),
                                {
                                    name: 'modules',
                                    ignorePath: '/app',
                                }
                ))
                .pipe(gulp.dest('app'));
});

// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function () {
    gulp.src('app/index.html')
        .pipe(wiredep({
            directory: 'app/lib'
        }))
        .pipe(gulp.dest('app'));
});

/////////////////////////////////////////////////////////////////////////////
// Comprime los archivos CSS y JS enlazados en el index.html
// y los minifica.

gulp.task('compress', function () {
    gulp.src('app/index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy', function(){
    gulp.src('app/index.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
    gulp.src('app/images/*')
        .pipe(gulp.dest('dist/images'));
    gulp.src('app/fonts/*')
        .pipe(gulp.dest('dist/fonts'));
    gulp.src('app/lib/bootstrap/fonts/*')
        .pipe(gulp.dest('dist/fonts'));
    gulp.src('app/views/*')
        .pipe(gulp.dest('dist/views'));
});

// Recarga el navegador cuando se producen cambios en los CSS
gulp.task('css', function(){
  gulp.src('./app/css/**/*.css')
    .pipe(connect.reload());
});

gulp.task('less', function(){
    gulp.src('./app/css/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('app/css'))
        .pipe(connect.reload());
})

// Recarga el navegador cuando hay cambio en el HTML
gulp.task('html', function(){
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

// Vigila los cambios que se produzcan en el código y lanza las tareas relacionadas
gulp.task('watch', function(){
  gulp.watch(['./app/**/*.html'], ['templates', 'html']);
  gulp.watch(['./app/css/**/*.css'], ['css']);
  gulp.watch(['./app/css/**/*.less'], ['less']);
  gulp.watch(['./app/js/**/*.js', './gulpfile.js'], ['inject']);
  gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('build-clean', function() {
    return gulp.src('./dist', {read: false}).pipe(clean({force: true}));
//  ^^^^^^
//   This is the key here, to make sure tasks run asynchronously!
});


gulp.task('default', function(callback){
    runSequence('inject',
                'inject-modules',
                'wiredep',
                'watch',
                'connect',
                callback);
});

gulp.task('prod', function(callback){
    runSequence('build-clean',
                'compress',
                'copy',
                'connect-build',
                callback);
});
