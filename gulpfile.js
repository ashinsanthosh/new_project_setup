var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    argv = require('yargs').argv,
    pro_name='project_name';

//Gulp Config
var config = {
    task: argv._[0],
    
    server: {
        hostname: argv.allowRemote ? '0.0.0.0' : 'localhost',
        port: argv.port ? argv.port : 3000,
        //If overriding port, kill the first gulp serve and
        //then run again. I dont know what's caching the old
        //value in browser
        livereloadport: argv.lrport ? argv.lrport : 35729
    },
    //Legacy testing flag. If "gulp serve --legacy" is invoked
    //via CLI, it will spawn a node server that does not initate
    //livereload. Websockets do work in legacy browsers like IE8
    env: argv.legacy ? 'legacy' : 'dev',
    paths: {
        scripts: {
            // these files will be minified and copied to the dest location
            // *including vendor scripts that get included in the head
            src: [
                'etc/designs/'+pro_name+'/clientlibs/js/*.js',
                'etc/designs/'+pro_name+'/clientlibs/js/compnents/*.js',
                'etc/designs/'+pro_name+'/clientlibs/js/vendor/modernizr.min.js',
                'etc/designs/'+pro_name+'/clientlibs/js/vendor/respond.min.js',
                'etc/designs/'+pro_name+'/clientlibs/js/vendor/jquery.placeholder.js',

            ],

            // these files will be contacted and minifed to vendor.js -- post load
            vendor: ['etc/designs/'+pro_name+'/clientlibs/js/vendor/*.js'],

            // output dir
            dest: 'dist/etc/designs/'+pro_name+'/clientlibs/js/',

            // Common script
            commonScript: 'etc/designs/'+pro_name+'/clientlibs/js/components/**/*.js'
        },
        images: {
            src: ['etc/designs/'+pro_name+'/clientlibs/images/**/*'],
            dest: 'dist/etc/designs/'+pro_name+'/images/'
        },
        fonts: {
            src: ['etc/designs/'+pro_name+'/fonts/*'],
            dest: 'dist/etc/designs/'+pro_name+'/fonts/'
        },
        scss: {
            index: 'etc/designs/'+pro_name+'/clientlibs/sass/index.scss',
            src: 'etc/designs/'+pro_name+'/clientlibs/sass/**/*.scss',
            dest: 'dist/etc/designs/'+pro_name+'/clientlibs/css/'
        }
    }
}



//Sass
gulp.task('sass', function() {
    var isDev = config.env != 'legacy' ? true : false;
    return gulp.src(config.paths.scss.index)
        .pipe($.sass({
            style: 'compressed',
            sourcemap: false
        }))
        .on('error', function(err) {
            console.log(err.message);
        })
        .pipe($.autoprefixer('last 2 versions', '> 1%', 'ie 8'))
        .pipe($.minifyCss({keepSpecialComments: 0}))
        .pipe(gulp.dest(config.paths.scss.dest))
        .pipe($.size())
        .pipe($.if(isDev, $.livereload()))
});

//Scripts
gulp.task('scripts', function() {
    return gulp.src(config.paths.scripts.src)
        .pipe($.uglify())
        .pipe(gulp.dest(config.paths.scripts.dest));
});

gulp.task('scripts-dev', function() {
    return gulp.src('etc/designs/'+pro_name+'/clientlibs/js/components/**/*.js')
        .pipe($.concat('main.js'))
        // .pipe($.uglify())
        .pipe(gulp.dest('dist/etc/designs/'+pro_name+'/clientlibs/js'));
});

//Vendor
gulp.task('vendor', function() {
    return gulp.src(config.paths.scripts.vendor)
        .pipe($.concat('vendor.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(config.paths.scripts.dest));
});

//JSHint
gulp.task('jshint', function() {
    return gulp.src(config.paths.scripts.commonScript)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

//Fonts
gulp.task('fonts', function() {
    return gulp.src(config.paths.fonts.src)
        .pipe(gulp.dest(config.paths.fonts.dest));
});

//Images
gulp.task('images', function() {
    return gulp.src(config.paths.images.src)
        .pipe(gulp.dest(config.paths.images.dest))
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })));
});

//Build
gulp.task('build', [
    'sass',
    'scripts',
    'vendor',
    'fonts',
    'images',
    'scripts-dev'
]);

//Default task is to build
gulp.task('default', [
    'build'
]);

//Serve
gulp.task('serve', ['build'], function () {
    var isLegacy = config.env == 'legacy' ? true : false,
        url = 'http://'+config.server.hostname + ':' + config.server.port,
        app = require('connect')()

    //Livereload Config
    if(!isLegacy){
        var lrBaseUrl = 'http://'+config.server.hostname + ':' + config.server.livereloadport
        app.use(require('connect-livereload')({
            port: config.server.livereloadport,
            src: lrBaseUrl + '/livereload.js?snipver=1'
        }))
    }

    app
        .use(require('serve-static')(__dirname))
        .use(require('serve-index')(__dirname));

    //Start Server
    require('http')
        .createServer(app)
        .listen(config.server.port)
        .on('listening', function () {
            console.log('Started connect web server on '+ url);
        });

    //Only watch if legacy flag is not declared
    if(!isLegacy){
        $.livereload.listen();

        gulp.watch(config.paths.scripts.src, ['build']);
        gulp.watch(config.paths.scripts.commonScript, ['build']);
        gulp.watch('components/**/*.html', ['build']);
        gulp.watch('*.html', ['build']);

        gulp.watch([
            'dist/etc/designs/'+pro_name+'/clientlibs/js/*.js',
            'dist/etc/designs/'+pro_name+'/clientlibs/images/*',
            'dist/etc/designs/'+pro_name+'/clientlibs/fonts/*'
        ]).on('change', function(file){
            $.livereload.changed(file.path);
        })
    }

    gulp.start('watch');
    require('opn')(url+'/homepage.html');
});

//Watch
gulp.task('watch', function() {
    gulp.watch(config.paths.scss.src, ['sass']);
});
