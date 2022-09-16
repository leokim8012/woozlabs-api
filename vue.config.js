/* eslint-disable no-global-assign */
module.exports = {
  transpileDependencies: ["vuetify"],
  // css: { loaderOptions: { scss: { prependData: ' @import "@/assets/styles/systemFonts.scss"; ' } } },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = process.env.VUE_APP_SITE_TITLE;
      args[0].description = process.env.VUE_APP_SITE_DESCRIPTION;
      return args;
    });
  },

  pluginOptions: {},
};
