import path from "path";

import webpack, { Configuration } from "webpack";
import nodeExternals from "webpack-node-externals";
import NodemonPlugin from "nodemon-webpack-plugin";

import rules from "./rules";
import { CraqPaqOptions } from "./types";

export default ({
  mode,
  cwd,
  src: { server },
  silent,
  output,
  env,
  version,
}: CraqPaqOptions): Configuration => {
  const distFilename = "server.js";

  return {
    mode,
    entry: { server: path.resolve(cwd, server) },
    module: {
      rules: rules(true),
    },
    stats: silent ? "errors-only" : "verbose",
    resolve: {
      symlinks: false,
      extensions: [".tsx", ".ts", ".js"],
    },
    target: "node",
    output: {
      publicPath: `/${output.assets}/`,
      assetModuleFilename: "[path][name][ext][query]",
      path: path.resolve(cwd, output.path),
      filename: distFilename,
    },
    plugins: [
      new webpack.DefinePlugin(
        Object.entries({ ...env[mode], ...env[`${mode}Server`] }).reduce(
          (result, [key, value]) => {
            result[key] = JSON.stringify(value);

            return result;
          },
          {
            CRAQ_CLIENT: JSON.stringify(false),
            CRAQ_SERVER: JSON.stringify(true),
            NODE_ENV: JSON.stringify(mode),
            VERSION: JSON.stringify(version),
            ASSETS_PATH: JSON.stringify(output.assets),
            STATS_FILE_PATH: JSON.stringify(
              path.resolve(cwd, output.path, output.assets, "stats.json")
            ),
          }
        )
      ),
      ...(mode === "development"
        ? [
            new NodemonPlugin({
              quiet: silent,
              script: path.resolve(cwd, output.path, distFilename),
              watch: [path.resolve(cwd, output.path, distFilename)],
              env: {
                NODE_ENV: mode,
                ...env[mode],
                ...env[`${mode}Server`],
              },
            }),
          ]
        : []),
    ],
    externals: [nodeExternals()],
  };
};
