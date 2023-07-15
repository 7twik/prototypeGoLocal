const HawkerHut = artifacts.require("HawkerHut");

module.exports = function (deployer) {
  deployer.deploy(HawkerHut, '10000000000000000000000');
};
