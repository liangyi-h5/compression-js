import gulp from 'gulp';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const obfuscate = require('gulp-obfuscate');
const cleanCSS = require('gulp-clean-css');

// 基本任务：压缩ESM JS文件
function compressESM() {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: [
        ['@babel/preset-env', {
          modules: false, // 保持ESM格式
          targets: {
            esmodules: true
          }
        }]
      ]
    }))
    .pipe(terser({
      module: true, // 确保Terser处理ESM
      ecma: 2020,
      keep_classnames: false,
      keep_fnames: false,
      toplevel: true
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
}

// 高级任务：压缩+混淆ESM JS文件
function obfuscateESM() {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: [
        ['@babel/preset-env', {
          modules: false,
          targets: {
            esmodules: true
          }
        }]
      ]
    }))
    .pipe(terser({
      module: true,
      ecma: 2020
    }))
    .pipe(obfuscate({
      compact: true,
      controlFlowFlattening: true,
      identifierNamesGenerator: 'hexadecimal',
      selfDefending: true,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      transformObjectKeys: true,
      unicodeEscapeSequence: false
    }))
    .pipe(rename({ suffix: '.obf' }))
    .pipe(gulp.dest('dist'));
}

// CSS压缩任务
function compressCSS() {
  return gulp.src('src/**/*.css')
    .pipe(cleanCSS({
      level: 2 // 高级优化，输出已经是最紧凑格式
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
}

// 导出任务
export { compressESM, obfuscateESM, compressCSS };
export default gulp.series(compressESM, obfuscateESM);