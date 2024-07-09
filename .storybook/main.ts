import type { StorybookConfig } from "@storybook/react-webpack5";


const path = require("path")

module.exports = {

  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'none',
  },

  webpackFinal: (config) => {
    config.resolve.alias['@module/constants'] = path.resolve(__dirname, '../src/constants')
    config.resolve.alias['@module/sorters'] = path.resolve(__dirname, '../src/sorters')
    config.resolve.alias['@module/utils'] = path.resolve(__dirname, '../src/utils')

    config.module.rules.push({
      test: /\.(sass|scss)$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: [
          path.resolve(__dirname, '../stories')
      ]
    })
    config.resolve.extensions.push('.sass')
    return config
  },

  docs: {}
}

// const config: StorybookConfig = {
  
// };
// export default config;
