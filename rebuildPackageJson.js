const chalk = require("chalk");
const fs = require("fs");
const klawSync = require("klaw-sync");
const path = require("path");

module.exports = function() {
  // Note: this function is called from index.js via .call(), so `this`
  // references the Application function defined in index.js  I just like making
  // files a little smaller and easier to read. :)

  console.log(chalk.bgGreen("Starting rebuild..." + "\n"));
  let abort = false;

  // Find available command files //////////////////////////////////////////////
  const files = klawSync(this.runawayDirectory, { nodir: true });

  files.forEach(file => {
    if (abort) {
      return;
    }

    // Skip files starting with "_"
    if (path.basename(file.path).indexOf("_") === 0) {
      return;
    }

    // Let's see if the file we're dealing with is inside the .bin directory.
    let relativeDir = path.basename(
      path.relative(file.path, this.runawayBinDirectory)
    );

    // With this we're skipping files that are inside .bin/ because those aren't
    // command files.
    if (relativeDir === ".bin") {
      const command = require(file.path);

      if (!command.command) {
        console.log(
          chalk.red(`${file.path} doesn't expose a command property!`)
        );

        console.log("\n" + chalk.bgRed("Rebuild aborted!"));

        abort = true;
        return;
      }

      // For later reference and error messages...
      command.path = file.path;

      if (!command.name) {
        let name = path.basename(file.path, path.extname(file.path));

        // Making it machine-safe
        name = name.replace(/[^a-zA-Z0-9-_]+/g, "-");

        command.name = name;
      }

      this.commands.push(command);
    }
  });

  // Update package.json ///////////////////////////////////////////////////////
  const packageJson = require(path.join(this.cwd, "package.json"));
  const scripts = {};

  this.commands.forEach(command => {
    if (abort) {
      return;
    }

    console.log(
      chalk.blue(
        `Found command ${chalk.bgWhite(command.name)} -> ${path.relative(
          this.cwd,
          command.path
        )}`
      )
    );

    // If the command starts with the runaway! flag, that means it's supposed to
    // reference a file in .runaway/.bin, so let's replace that accordingly.
    if (command.command.indexOf("runaway!") === 0) {
      let scriptPath = path.relative(
        this.cwd,
        path.join(
          this.runawayBinDirectory,
          command.command.split("runaway!")[1]
        )
      );

      if (!fs.existsSync(scriptPath) && !fs.existsSync(scriptPath.split(".js")[0] + ".js")) {
        console.log(
          chalk.red(
            `Script ${path.relative(this.cwd, scriptPath)} does't exist!`
          )
        );
        console.log(
          `^^ Problem caused by: ${chalk.yellow(
            path.relative(this.cwd, command.path)
          )}`
        );

        console.log("\n" + chalk.bgRed("Rebuild aborted!"));
        abort = true;
        return;
      }

      console.log(
        chalk.cyan(`${command.name} -> using .bin script ${scriptPath}`)
      );

      command.command =
        "node " +
        path.join(
          path.relative(this.cwd, this.runawayBinDirectory),
          command.command.split("runaway!")[1]
        );
    }

    console.log();

    scripts[command.name] = command.command;
  });

  if (!abort) {
    packageJson.scripts = scripts;

    console.log("Writing to package.json...");

    fs.writeFileSync(
      path.join(this.cwd, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );

    console.log(chalk.bgGreen("Success!"));
  }
};
