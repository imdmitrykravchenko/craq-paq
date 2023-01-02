import fs from "fs";
import path from "path";

const config = {
  src: {
    client: "./src/client.ts",
    server: "./src/server.ts",
  },
  output: {
    path: "./build",
    assets: "assets",
  },
  serve: {
    hostname: "localhost",
    port: 9000,
  },
  silent: true,
  env: {
    development: {},
    production: {},
  },
};

const init = () => {
  const filepath = path.resolve(process.cwd(), "craq.config.json");

  if (fs.existsSync(filepath)) {
    throw new Error('File "craq.config.json" already exists');
  }

  fs.writeFileSync(filepath, JSON.stringify(config, null, "  "));
};

export default init;
