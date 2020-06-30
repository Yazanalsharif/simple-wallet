var SimpleWallet = artifacts.require("./simpleWallet.sol");


module.exports = function(deployer) {
  deployer.deploy(SimpleWallet);
};
