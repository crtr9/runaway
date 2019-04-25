module.exports = {
  // Because we've started this command with "runaway!", --rebuild will do a
  // substitution with `node .runaway/.bin/clean.js`.  This is just a handy
  // little short-hand.
  command: "runaway!clean.js"
};
