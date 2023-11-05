module.exports = {
  src: {
    client: "./tests/client.ts",
    server: "./tests/server.ts",
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
