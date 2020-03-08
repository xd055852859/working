// vue.config.js
module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader")
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
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          "primary-color": "#1ACA8E"
          //   'link-color': '#1DA57A',
          //   'border-radius-base': '2px',
        },
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    historyApiFallback: true
  }
};
