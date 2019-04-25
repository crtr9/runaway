#!/usr/bin/env node

const path = require("path");

const klawSync = require("klaw-sync");

const rebuildPackageJson = require("./rebuildPackageJson");

const Application = function() {
  this.cwd = process.cwd();
  this.runawayDirectory = path.join(this.cwd, ".runaway");
  this.runawayBinDirectory = path.join(this.runawayDirectory, ".bin");
  this.commands = [];

  // TODO: Check if .runaway/ exists.

  const files = klawSync(this.runawayDirectory, { nodir: true });

  files.forEach(file => {
    if (
      path.basename(path.relative(file.path, this.runawayBinDirectory)) ===
      ".bin"
    ) {
      const command = require(file.path);

      if (!command.name) {
        // TODO: Make machine-safe
        command.name = path.basename(file.path, path.extname(file.path));
      }

      this.commands.push(command);
    }
  });

  var argv = require("minimist")(process.argv.slice(2));

  if (argv["rebuild-packagejson"]) {
    rebuildPackageJson.call(this);
  }
};

new Application();
