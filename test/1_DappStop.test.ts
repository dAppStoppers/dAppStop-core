import { BigNumber, Wallet } from "ethers";

import { DappStopPoP } from "./../typechain/contracts/DappStopPoP";
import { DappStopRegistry } from "./../typechain/contracts/DappStopRegistry";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";
import { expect } from "chai";

require("dotenv").config();

const { ethers, deployments } = require("hardhat");

let owner: SignerWithAddress;
let buyer: SignerWithAddress;

let REGISTRY: DappStopRegistry;
let POP: DappStopPoP;

describe("DappStop", function () {
  beforeEach(async function () {
    // Get Signers
    [owner, buyer] = await ethers.getSigners();

    // Setup Test
    await deployments.fixture(["DappStop"]);
    REGISTRY = await ethers.getContract("DappStopRegistry", owner);
    POP = await ethers.getContract("DappStopPoP", owner);

    expect(await REGISTRY.DAPPSTOP_POP()).to.equal(POP.address);
    expect(await POP.REGISTRY()).to.equal(REGISTRY.address);
    expect(await POP.name()).to.equal("DappStopPoP");
    expect(await POP.symbol()).to.equal("DSPOP");
  });

  describe("DappStop", function () {
    beforeEach(async function () {});

    it("should register", async function () {
      await REGISTRY.register({
        creator: owner.address,
        popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ",
        ceramicURI:
          "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0o",
        price: ethers.utils.parseEther("0.01"),
      });

      expect(await REGISTRY.getCreator(0)).to.equal(owner.address);
      expect(await REGISTRY.getPoPURI(0)).to.equal(
        "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ"
      );
      expect(await REGISTRY.getCeramicURI(0)).to.equal(
        "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0o"
      );
      expect(await REGISTRY.getPrice(0)).to.equal(
        ethers.utils.parseEther("0.01")
      );
    });
    it("should buy", async function () {});
    it("should update", async function () {});
  });
});
