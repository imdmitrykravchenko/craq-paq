import path from "path";

import webpack, { Configuration } from "webpack";
import { StatsWriterPlugin } from "webpack-stats-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import rules from "./rules";
import { CraqPaqOptions } from "./types";

export default ({
  mode,
  cwd,
  src: { client },
  silent,
  output,
}: CraqPaqOptions): Configuration => {
  const filename = `[name]${mode === "production" ? ".[contenthash]" : ""}`;

  return {
    mode,
    entry: {
      bundle: path.resolve(cwd, client),
    },
    devtool: `${mode === "development" ? "eval-cheap-" : ""}source-map`,
    module: {
      rules: rules(false, MiniCssExtractPlugin.loader),
    },
    plugins: [
      new webpack.DefinePlugin({
        CRAQ_CLIENT: JSON.stringify(true),
        CRAQ_SERVER: JSON.stringify(false),
        NODE_ENV: JSON.stringify(mode),
      }),
      new MiniCssExtractPlugin({ filename: `${filename}.css` }),
      new StatsWriterPlugin({ filename: "stats.json" }),
    ],
    resolve: {
      fallback: {
        assert: false,
        buffer: false,
        console: false,
        child_process: false,
        constants: false,
        module: false,
        crypto: false,
        domain: false,
        events: false,
        http: false,
        https: false,
        fs: false,
        os: false,
        path: false,
        punycode: false,
        process: false,
        querystring: false,
        stream: false,
        string_decoder: false,
        sys: false,
        timers: false,
        tty: false,
        url: false,
        util: false,
        vm: false,
        zlib: false,
      },
      extensions: [".tsx", ".ts", ".js"],
    },
    infrastructureLogging: {
      level: silent ? "error" : "info",
    },
    stats: silent ? "errors-only" : "normal",
    output: {
      publicPath: `/${output.assets}/`,
      assetModuleFilename: "[path][name][ext][query]",
      path: path.resolve(cwd, output.path, output.assets),
      filename: `${filename}.js`,
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name: "vendor",
            reuseExistingChunk: true,
          },
        },
      },
    },
    ...(mode === "development" && {
      devServer: {
        port: 3000,
        bonjour: false,
        static: false,
        devMiddleware: {
          writeToDisk: (file) => file.endsWith("stats.json"),
        },
      },
    }),
  };
};
