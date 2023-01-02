import assign from "object-assign-deep";

import { CraqPaqOptions } from "./types";

const normalizeOptions = (options: Partial<CraqPaqOptions>) =>
  assign(
    {
      output: {
        path: "./build",
        assets: "assets",
      },
      serve: {
        hostname: "localhost",
        port: 9000,
      },
      silent: true,
      env: {},
    } as CraqPaqOptions,
    options
  );

export default normalizeOptions;
