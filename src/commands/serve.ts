import path from "path";
import dotenv from "dotenv";
import webpack, { Configuration } from "webpack";
import redbird from "redbird";
import WebpackDevServer from "webpack-dev-server";

import getClientConfig from "../client.config";
import getServerConfig from "../server.config";
import { CraqPaqOptions } from "../types";
import normalizeOptions from "../normalizeOptions";

dotenv.config({ path: path.join(__dirname, ".env") });

const getRunnerWith =
  (getConfig: (options: CraqPaqOptions) => Configuration) =>
  (options: CraqPaqOptions) =>
    new Promise<void>((resolve, reject) => {
      const config = getConfig({ ...options, mode: "development" });
      const { devServer } = config;
      const compiler = webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
          reject(err || stats);
        }

        if (devServer) {
          resolve(new WebpackDevServer(devServer, compiler).start());
        } else {
          resolve();
        }
      });
    });

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

  if (!normalizedOptions.src.client && !normalizedOptions.src.server) {
    throw new Error("Define at least either server or client");
  }

  if (normalizedOptions.src.client) {
    await getRunnerWith(getClientConfig)(normalizedOptions);
  }

  if (normalizedOptions.src.server) {
    await getRunnerWith(getServerConfig)(normalizedOptions);
  }

  runProxy(normalizedOptions);
};

export default runDev;
