const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  framework: "@storybook/react",
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-postcss",
      options: {
        cssLoaderOptions: {
          // When you have splitted your css over multiple files
          // and use @import('./other-styles.css')
          importLoaders: 1,
        },
        postcssLoaderOptions: {
          // When using postCSS 8
          implementation: require("postcss"),
        },
      },
    },
  ],
  webpackFinal: async (config) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin());
    return config;
  },
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  staticDirs: ["../public"],
};
