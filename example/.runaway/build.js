module.exports = {
  // We're using npm-run-all to run the clean command, then the typescript
  // command.  Not that it makes sense to do it here, but you can do:
  //     npm-run-all --parallel clean typescript and the two commands would run
  //     in parallel.  Might make more sense for compiling SCSS and TypeScript?
  command: "npm-run-all clean parallel-build"
};
