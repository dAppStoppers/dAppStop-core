import { ethers } from "hardhat";

require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments, getChainId }: any) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // Config
  console.log(`Deploying DappStopRegistry Contract... from ${deployer}`);

  // Chain Specific Parameters
  if (chainId === "80001") {
    console.log("Polygon Testnet Deployment");
    // TODO: Add Rinkeby Parameters
  } else if (chainId === "1001") {
    console.log("Klaytn Testnet Deployment");
    // TODO: Add Rinkeby Parameters
  } else if (chainId === "69") {
    console.log("Optimism Testnet Deployment");
  } else if (chainId === "31337") {
    console.log("Localhost Deployment");
  } else {
    console.log("Unknown Chain");
  }

  let contract = await deploy("DappStopRegistry", {
    from: deployer,
    args: [],
  });

  // gasLogger.addDeployment(contract);
};

module.exports.tags = ["DappStop"];
