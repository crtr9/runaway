const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

module.exports = function() {
  if (!fs.existsSync(path.join(this.cwd, ".runaway"))) {
    console.log(chalk.green("Creating .runaway/"));
    fs.mkdirSync(path.join(this.cwd, ".runaway"));
    console.log(chalk.green("Creating .runaway/.bin/"));
    fs.mkdirSync(path.join(this.cwd, ".runaway", ".bin"));

    let buildCommand = fs
      .readFileSync(path.join(__dirname, "init-seed", "build.js"))
      .toString();

    let buildScript = fs
      .readFileSync(path.join(__dirname, "init-seed", "bin", "build.js"))
      .toString();

    console.log(chalk.green("Seeding .runaway/build.js"));
    fs.writeFileSync(path.join(this.cwd, ".runaway", "build.js"), buildCommand);
    console.log(chalk.green("Seeding .runaway/.bin/build.js"));
    fs.writeFileSync(
      path.join(this.cwd, ".runaway", ".bin", "build.js"),
      buildScript
    );

    console.log(chalk.bgGreen("Success!"));
  } else {
    console.log(chalk.yellow(".runaway/ already exists!"));
    console.log(chalk.bgRed("Aborting --init"));
  }
};
