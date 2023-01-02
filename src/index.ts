#!/usr/bin/env node
import path from "path";
import { createCommand } from "commander";
import init from "./commands/init";
import serve from "./commands/serve";
import build from "./commands/build";
const program = createCommand();

program
  .name("craq-paq")
  .description("Webpack based cli utility for building craq application");

const getConfig = (cwd: string) =>
  require(path.resolve(cwd, "craq.config.json"));

program.command("init").action(async () => {
  await init();
});

program
  .command("serve")
  .description("Development server")
  .action(() => {
    const cwd = process.cwd();

    return serve({ ...getConfig(cwd), cwd });
  });

program
  .command("build")
  .description("Production build")
  .action(() => {
    const cwd = process.cwd();

    return build({ ...getConfig(cwd), cwd });
  });

program.parse();
