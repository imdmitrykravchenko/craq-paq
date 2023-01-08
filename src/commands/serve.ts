import path from "path";
import dotenv from "dotenv";
import webpack from "webpack";
import redbird from "redbird";
import express from "express";
import wdm from "webpack-dev-middleware";

import getClientConfig from "../client.config";
import getServerConfig from "../server.config";
import { CraqPaqOptions } from "../types";
import normalizeOptions from "../normalizeOptions";

dotenv.config({ path: path.join(__dirname, ".env") });

const runProxy = ({ serve, output }: CraqPaqOptions) => {
  const proxy = redbird({ port: serve.port, bunyan: false });
  const url = `http://${serve.hostname}:${serve.port}`;
  const localhost = "http://localhost";

  proxy.register(
    `${url}/${output.assets}`,
    `${localhost}:3000/${output.assets}`
  );
  proxy.register(url, `${localhost}:3001/`);

  console.info(`CRAQ is available at ${url}`);
};

const runDev = async (options: Partial<CraqPaqOptions>) => {
  const normalizedOptions = normalizeOptions(options);

  normalizedOptions.mode = "development";

  if (!normalizedOptions.src.client && !normalizedOptions.src.server) {
    throw new Error("Define at least either server or client");
  }

  if (normalizedOptions.src.client) {
    const compiler = webpack(getClientConfig(normalizedOptions));
    const app = express();

    app.use(
      wdm(compiler, {
        publicPath: compiler.options.output.publicPath,
        writeToDisk: (file) => file.endsWith("stats.json"),
      })
    );
    app.listen(3000);
  }

  if (normalizedOptions.src.server) {
    const compiler = webpack(getServerConfig(normalizedOptions));

    await new Promise<void>((resolve, reject) => {
      compiler.watch({}, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          stats.compilation.errors.forEach((error) =>
            console.error(error.message)
          );
          resolve();
        }
      });
    });
  }

  runProxy(normalizedOptions);
};

export default runDev;
