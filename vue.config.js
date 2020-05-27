const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: '/',
  pages: {
    index: {
      // entry for the page
      entry: 'vue/main.js',
      // the source template
      template: 'vue/index.html',
      // output as dist/index.html
      // filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      // title: 'Index Page',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      // chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // when using the entry-only string format,
    // template is inferred to be `public/subpage.html`
    // and falls back to `public/index.html` if not found.
    // Output filename is inferred to be `subpage.html`.
    // subpage: 'src/subpage/main.js'
  },
  outputDir: path.resolve('vue-dist'),
  assetsDir: 'assets',
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/styles/_brand-colors.scss";',
      },
    },
  },
  configureWebpack: {
    // NOTE: the BundleANalyzerPlugin is only needed for checking the file size of the finished bundle and the files in it.
    // plugins: [new BundleAnalyzerPlugin()],
    devtool: (process.env.NODE_ENV !== 'production') ? 'eval-source-map' : '',
    watchOptions: {
      ignored: [/node_modules/, /public/],
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.resolve('vue'),
      },
    },
  },
}
