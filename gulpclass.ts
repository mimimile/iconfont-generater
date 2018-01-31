import { Gulpclass, Task, SequenceTask } from 'gulpclass/Decorators'

const gulp = require('gulp')
const path = require('path')

const iconFont = require('gulp-iconfont')
const jsonTransform = require('gulp-json-transform')
const clean = require('gulp-clean')

const resolve = (v: string) => path.resolve(__dirname, v)

@Gulpclass()
export class Gulpfile {
  @Task()
  clean() {
    return gulp.src(resolve('dist/**/*')).pipe(clean())
  }

  @Task()
  copySvgs() {
    return gulp.src(resolve('src/svgs/*.svg')).pipe(gulp.dest(resolve('dist/svgs')))
  }

  @Task()
  mkFont() {
    return gulp.src(resolve('dist/svgs/*.svg'))
    .pipe(iconFont({
      fontName: 'qc-icons',
      prependUnicode: true,
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
    }))
    .on('glyphs', (glyphs: any) => {
      gulp.src(resolve('src/iconfont.json'))
      .pipe(jsonTransform((data: any) => {
        const iconList: {[key: string]: string} = {}
        glyphs.forEach(({ name, unicode }: { name: string, unicode: string }) => {
          iconList[name] = `${unicode}`.charCodeAt(0).toString(16)
        })
        data.iconList = iconList
        return data
      }))
      .pipe(gulp.dest(resolve('dist')))
    })
    .pipe(gulp.dest(resolve('dist')))

  }

  @SequenceTask()
  default() {
    return ['clean', 'copySvgs', 'mkFont']
  }
}
