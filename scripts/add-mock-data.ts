import { DappStopRegistry } from "./../typechain/contracts/DappStopRegistry";
import { ethers } from "hardhat";

async function main() {
  // Get Signer
  const [deployer] = await ethers.getSigners();

  // Get Registry contract
  const REGISTRY: DappStopRegistry = await ethers.getContract(
    "DappStopRegistry",
    deployer
  );

  // Get Fill Up Mock Data
  const mock_1 = {
    creator: deployer.address,
    popURI: "ipfs://Qmcx1sZhGMVFGyQuRBaMG9RUWT4egT9RHfds988MDjJt8N",
    ceramicURI:
      "ceramic://kjzl6cwe1jw147s5ghq4qre2j4or9bj7vmwqa03oaierdl5hmd6b3soyb7is27p",
    price: ethers.utils.parseEther("0.05"),
  };

  const mock_2 = {
    creator: deployer.address,
    popURI: "ipfs://QmVUKs8DZKTwnYw3Ffje7bSipVD1kZqMJBNLQCsbZckYN4",
    ceramicURI:
      "ceramic://kjzl6cwe1jw14bh206e6r2drq5s7y9ildzv3sovrgis3gs7mr14gj07fs8g6fhz",
    price: ethers.utils.parseEther("0.03"),
  };

  const mock_3 = {
    creator: deployer.address,
    popURI: "ipfs://QmbVHVJQ3ERvTuPnPVMMWVJA5SkETMe7hhpfjkv9LnKTeo",
    ceramicURI:
      "ceramic://kjzl6cwe1jw148zedfhbnmur4nt63bnxu3asg2qf398xjrhalydm80lla9e4ic8",
    price: ethers.utils.parseEther("0.03"),
  };

  // Register Mock Data
  await REGISTRY.register(mock_1);
  await REGISTRY.register(mock_2);
  await REGISTRY.register(mock_3);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
