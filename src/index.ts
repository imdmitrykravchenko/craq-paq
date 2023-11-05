#!/usr/bin/env node
import path from "path";
import { cosmiconfigSync } from "cosmiconfig";
import { createCommand } from "commander";
import init from "./commands/init";
import serve from "./commands/serve";
import build from "./commands/build";
const program = createCommand();

program
  .name("craq-paq")
  .description("Webpack based cli utility for building craq application");

const getConfig = (cwd: string) => {
  const result = cosmiconfigSync("craq").search(cwd);

  if (!result) {
    throw new Error("Config file not found");
  }

  return result.config;
};

const getVersion = (cwd: string) => {
  try {
    return require(path.resolve(cwd, "package.json")).version;
  } catch (e) {
    return "unknown";
  }
};

program.command("init").action(async () => {
  await init();
});

program
  .command("serve")
  .description("Development server")
  .action(() => {
    const cwd = process.cwd();

    return serve({ ...getConfig(cwd), version: getVersion(cwd), cwd });
  });

program
  .command("build")
  .description("Production build")
  .action(async () => {
    const cwd = process.cwd();

    try {
      await build({ ...getConfig(cwd), version: getVersion(cwd), cwd });
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program.parse();
