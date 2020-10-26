
// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development'

// 本地环境是否需要使用cdn； 值对应 true / false
const devNeedCdn = true

// cdn链接
// 插件或者框架具体cdn链接，可去官网查找，一般都会有对应的cdn链接地址；
// 项目资源 如打包后的静态资源（改变不频繁） css, js, img 等资源 可上传到公司cdn服务器；在把对应的链接写入css 即可
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    // vue: 'vue 官方cdn链接',
    // vuex: 'Vuex 官方cdn链接',
    // 'vue-router': 'VueRouter 官方cdn链接'
  },
  // cdn的css链接
  css: [],
  // cdn的js链接
  js: []
}

module.exports = {
  productionSourceMap: false,
  devServer: {
    port: 8088, // 端口号
    host: 'localhost',
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    // 可配置多个代理 proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
    proxy: {
      '/api1': {
        target: '<url1>',
        ws: true,
        changeOrigin: true
      },
      '/api2': {
        target: '<url2>'
      }
    }
  },
  css: {
    loaderOptions: {
      // rem 适配； 项目中写实际的ui稿尺寸即可， 插件会自动换算
      // selectorBlackList 配置项 排除某些你不想转换rem的样式， 比如ui框架，插件的像素值； 项目中的话不想换算rem的建议统一前置类名
      postcss: {
        plugins: [
          // require('autoprefixer')({
          //   browsers: [
          //     'Android 4.1',
          //     'iOS 7.1',
          //     'Chrome > 31',
          //     'ff > 31',
          //     'ie >= 8'
          //   ],
          // }),
          require('postcss-pxtorem')({
            rootValue: 37.5,
            propList: ['*'],
            minPixelValue: 2, // 最小像素值
            selectorBlackList: ['.ignore', '.hairlines','van-'] // 排除van-开头(即vant库中的css样式)的class名
          })
          // require('postcss-pxtorem')({ //配置项，详见官方文档
          //   viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750.
          //   viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334.
          //   unitPrecision: 3, // (指定`px`转换为视窗单位值的小数位数（很多时候无法整除).
          //   viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw.
          //   selectorBlackList: ['.ignore', '.hairlines','van'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名.
          //   minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值.
          //   mediaQuery: false // 允许在媒体查询中转换`px`.
          // }), // 换算的基数
        ]
      }
    }
  },
  chainWebpack: config => {
    // ============压缩图片 start============
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({ bypassOnDebug: true })
      .end()
    // ============注入cdn start============
    config.plugin('html').tap(args => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn
      return args
    })
  },
  configureWebpack: config => {
    // 用cdn方式引入，则构建时要忽略相关资源
    if (isProduction || devNeedCdn) config.externals = cdn.externals

    // 生产环境相关配置
    if (isProduction) {
      // 代码压缩
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            //生产环境自动删除console
            compress: {
              warnings: false, // 若打包错误，则注释这行
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        })
      )

      // gzip压缩
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' + productionGzipExtensions.join('|') + ')$'
          ),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      )

      // 公共代码抽离
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: 'all',
              test: /node_modules/,
              name: 'vendor',
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 100
            },
            common: {
              chunks: 'all',
              test: /[\\/]src[\\/]js[\\/]/,
              name: 'common',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60
            },
            styles: {
              name: 'styles',
              test: /\.(sa|sc|c)ss$/,
              chunks: 'all',
              enforce: true
            },
            runtimeChunk: {
              name: 'manifest'
            }
          }
        }
      }
    }
  }
}
