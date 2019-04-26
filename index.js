#!/usr/bin/env node

const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const rebuildPackageJson = require("./rebuildPackageJson");
const initRunaway = require("./initRunaway");

const Application = function() {
  this.cwd = process.cwd();
  this.runawayDirectory = path.join(this.cwd, ".runaway");
  this.runawayBinDirectory = path.join(this.runawayDirectory, ".bin");
  this.commands = [];

  let argv = require("minimist")(process.argv.slice(2));

  if (argv.rebuild) {
    // Need to make sure the .runaway directory exists.
    if (!fs.existsSync(this.runawayDirectory)) {
      console.log(
        chalk.red(".runaway/ doesn't exist.") + " Did you run runaway --init ?"
      );
      return;
    }

    rebuildPackageJson.call(this);
  } else if (argv.init) {
    initRunaway.call(this);
  } else {
    console.log(fs.readFileSync(path.join(__dirname, "help.txt")).toString());
  }
};

new Application();
