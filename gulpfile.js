const gulp = require("gulp");
const less = require("gulp-less");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const browserSync = require("browser-sync").create();

const paths = {
    styles: {
        src: "dist/less/*.less",
        dest: "src/css/"
    },
    scripts: {
        src: "dist/es7/*.js",
        dest: "src/js/"
    }
};

function clean() {
    return del(["assets"]);
}

function styles() {
    return gulp
        .src(paths.styles.src)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(
            rename({
                basename: "style",
                suffix: ".min"
            })
        )
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp
        .src(paths.scripts.src, { sourcemaps: true })
        .pipe(
            babel({
                presets: ["@babel/env"]
            })
        )
        .pipe(uglify())
        .pipe(concat("bundle.min.js"))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
}

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = gulp.series(clean, gulp.parallel(styles, scripts));
exports.default = watch;
