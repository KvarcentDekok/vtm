"use strict";

const gulp = require("gulp");
const sourcemap = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const del = require("del");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config.js");
const concat = require('gulp-concat');
const include = require('gulp-file-include');
const named = require('vinyl-named');
const atImport = require('postcss-import');

const plugins = [
    'node_modules/swiper/swiper-bundle.min.css'
];

const config = (file) => ({
    plugins: [
        atImport({root: file.dirname}),
        autoprefixer()
    ]
})

gulp.task("css", () => {
    return gulp.src("source/css/style.css")
        .pipe(sourcemap.init())
        .pipe(postcss(config))
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());
});

gulp.task("css:libs", () => {
    if (plugins.length > 0) {
        return gulp.src(plugins)
            .pipe(concat('libs.min.css'))
            .pipe(gulp.dest('build/css/'))
    }
});

gulp.task("html", () => {
    return gulp.src("source/*.html")
        .pipe(include())
        .pipe(gulp.dest("build"));
});

gulp.task("js", () => {
    return gulp.src([
        './source/js/general.js',
        './source/js/index.js'
    ])
        .pipe(named())
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest("./build/js"));
});

gulp.task("server", () => {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("source/css/**/*.css", gulp.series("css"));
    gulp.watch("source/img/*.svg", gulp.series("build", "refresh"));
    gulp.watch("source/js/**/*.js", gulp.series("build", "refresh"));
    gulp.watch("source/**/*.html", gulp.series("build", "refresh"));
});

gulp.task("copy", () => {
    return gulp.src([
        "source/fonts/**/*.{woff,woff2}",
        "source/img/**"
    ], {
        base: "source"
    })
        .pipe(gulp.dest("build"));
});

gulp.task("copy:favicon", () => {
    return gulp.src([
        "source/favicon/**"
    ], {
        base: "source/favicon"
    })
        .pipe(gulp.dest("build"));
});

gulp.task("clean", () => {
    return del("build");
});

gulp.task("refresh", (done) => {
    server.reload();
    done();
});


gulp.task("build", gulp.series("clean", "copy", "copy:favicon", "html", "css", "css:libs", "js"));
gulp.task("start", gulp.series("build", "server"));
