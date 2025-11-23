const TimeLockJournal = artifacts.require("TimeLockJournal");

module.exports = function (deployer) {
  deployer.deploy(TimeLockJournal);
};