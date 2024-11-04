var gulp = require('gulp')
var watch = require('gulp-watch') // 注意：gulp 4 默认已经包含了 watch 功能，你可能不需要额外的 gulp-watch 插件

const shell = require('gulp-shell')

var source_path = ['packages/**/*']
// 执行npm构建命令
gulp.task(
  'execute-command',
  shell.task(
    'D:\\微信web开发者工具\\cli.bat build-npm --project G:\\coolui-scroller\\demo --appid wx2537a62364a912fd'
  )
)

// 监听文件修改
gulp.task('watch', function () {
  watch(source_path, function () {
    // 当文件变化时，执行指定的任务系列
    gulp.series('execute-command')()
  })
})

// 设置默认任务
gulp.task('default', gulp.series('watch'))
