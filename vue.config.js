// vue.config.js
// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');

// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development';
module.exports = {
  productionSourceMap: false,
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule.use('vue-svg-loader').loader('vue-svg-loader');
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end();
    // config.module
    //   .rule("fonts")
    //   .use("url-loader")
    //   .loader("url-loader")
    //   .tap(options => {
    //     options.limit = { limit: 10000, name: "fonts/[name].[hash:7].[ext]" };
    //     // options.fallback.options.name ="fonts/[name].[hash:7].[ext]";
    //     return options;
    //   })
    //   .end();
    // {
    //   test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    //   loader: "url-loader",
    //   options: {
    //     limit: 10000,
    //     name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
    //   }
    // }
  },
  // configureWebpack: (config) => {
  //   // 用cdn方式引入，则构建时要忽略相关资源
  //   // 生产环境相关配置
  //   if (isProduction) {
  //     // 代码压缩
  //     config.plugins.push(
  //       new UglifyJsPlugin({
  //         uglifyOptions: {
  //           //生产环境自动删除console
  //           compress: {
  //             warnings: false, // 若打包错误，则注释这行
  //             drop_debugger: true,
  //             drop_console: true,
  //             pure_funcs: ['console.log'],
  //           },
  //         },
  //         sourceMap: false,
  //         parallel: true,
  //       })
  //     );

  //     // gzip压缩
  //     const productionGzipExtensions = ['html', 'js', 'css'];
  //     config.plugins.push(
  //       new CompressionWebpackPlugin({
  //         filename: '[path].gz[query]',
  //         algorithm: 'gzip',
  //         test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
  //         threshold: 10240, // 只有大小大于该值的资源会被处理 10240
  //         minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
  //         deleteOriginalAssets: false, // 删除原文件
  //       })
  //     );

  //     // 公共代码抽离
  //     config.optimization = {
  //       splitChunks: {
  //         cacheGroups: {
  //           vendor: {
  //             chunks: 'all',
  //             test: /node_modules/,
  //             name: 'vendor',
  //             minChunks: 1,
  //             maxInitialRequests: 5,
  //             minSize: 0,
  //             priority: 100,
  //           },
  //           common: {
  //             chunks: 'all',
  //             test: /[\\/]src[\\/]js[\\/]/,
  //             name: 'common',
  //             minChunks: 2,
  //             maxInitialRequests: 5,
  //             minSize: 0,
  //             priority: 60,
  //           },
  //           styles: {
  //             name: 'styles',
  //             test: /\.(sa|sc|c)ss$/,
  //             chunks: 'all',
  //             enforce: true,
  //           },
  //           runtimeChunk: {
  //             name: 'manifest',
  //           },
  //         },
  //       },
  //     };
  //   }
  // },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#1ACA8E',
          //   'link-color': '#1DA57A',
          //   'border-radius-base': '2px',
        },
        javascriptEnabled: true,
      },
    },
  },
  devServer: {
    historyApiFallback: true,
  },
};
