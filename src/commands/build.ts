import webpack, { Configuration } from "webpack";

import getClientConfig from "../client.config";
import getServerConfig from "../server.config";
import normalizeOptions from "../normalizeOptions";
import { CraqPaqOptions } from "../types";

const getRunnerWith =
  (getConfig: (options: CraqPaqOptions) => Configuration) =>
  (options: CraqPaqOptions) =>
    new Promise<void>((resolve, reject) => {
      const compiler = webpack(getConfig({ ...options, mode: "production" }));

      compiler.run((err, stats) => {
        compiler.close(() => {
          if (err || stats.hasErrors()) {
            reject(err || stats.compilation.errors);
          }
          resolve();
        });
      });
    });

const runBuild = async (options: Partial<CraqPaqOptions>) => {
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
};

export default runBuild;
