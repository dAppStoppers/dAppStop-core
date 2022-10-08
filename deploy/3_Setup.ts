import { DappStopPoP } from "../typechain/contracts/DappStopPoP";
import { DappStopRegistry } from "../typechain/contracts/DappStopRegistry";
import { ethers } from "hardhat";

require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments, getChainId }: any) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  let REGISTRY: DappStopRegistry = await ethers.getContract(
    "DappStopRegistry",
    deployer
  );
  let POP: DappStopPoP = await ethers.getContract("DappStopPoP", deployer);

  // Set POP on Registry
  await REGISTRY.setPOP(POP.address);

  // Set Registry on POP
  await POP.setRegistry(REGISTRY.address);

  console.log("Setup Complete");
};

module.exports.tags = ["DappStop"];
