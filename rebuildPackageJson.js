const path = require("path");
const fs = require("fs");

module.exports = function() {
  const packageJson = require(path.join(this.cwd, "package.json"));

  const scripts = {};

  this.commands.forEach(command => {
    if (command.command.indexOf("runaway!") === 0) {
      command.command =
        "node " +
        path.join(
          path.relative(this.cwd, this.runawayBinDirectory),
          command.command.split("runaway!")[1]
        );
    }

    scripts[command.name] = command.command;
  });

  packageJson.scripts = scripts;

  fs.writeFileSync(
    path.join(this.cwd, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
};
