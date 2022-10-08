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
      expect(await REGISTRY.getDappCount()).to.equal(1);

      let dappInfo = await REGISTRY.getDappInfo(0);

      expect(dappInfo.creator).to.equal(owner.address);
      expect(dappInfo.popURI).to.equal(
        "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ"
      );
      expect(dappInfo.ceramicURI).to.equal(
        "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0o"
      );
      expect(dappInfo.price).to.equal(ethers.utils.parseEther("0.01"));

      expect(await POP.exists(0)).to.equal(true);
      expect(await POP.exists(1)).to.equal(false);
    });

    it("should not register (invalid creator address)", async function () {
      await expect(
        REGISTRY.register({
          creator: ethers.constants.AddressZero,
          popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ",
          ceramicURI:
            "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0o",
          price: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("DappStopRegistry: Invalid creator address!");
    });

    it("should not register (invalid popURI)", async function () {
      await expect(
        REGISTRY.register({
          creator: owner.address,
          popURI: "",
          ceramicURI:
            "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0o",
          price: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("DappStopRegistry: Invalid popURI!");
    });
    it("should not register (invalid ceramicURI)", async function () {
      await expect(
        REGISTRY.register({
          creator: owner.address,
          popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ",
          ceramicURI: "",
          price: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("DappStopRegistry: Invalid ceramicURI!");
    });

    it("should buy", async function () {
      await REGISTRY.register({
        creator: owner.address,
        popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ",
        ceramicURI:
          "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0o",
        price: ethers.utils.parseEther("0.01"),
      });

      await REGISTRY.connect(buyer).buy(0, {
        value: ethers.utils.parseEther("0.01"),
      });

      expect(await POP.balanceOf(buyer.address, 0)).to.equal(1);
      expect(await POP.uri(0)).to.equal(
        "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ"
      );
      expect(await POP.tokenSupply(0)).to.equal(1);
      expect(await POP.totalSupply(0)).to.equal(1);
    });

    it("should not buy more than 1", async function () {
      await REGISTRY.register({
        creator: owner.address,
        popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ",
        ceramicURI:
          "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0o",
        price: ethers.utils.parseEther("0.01"),
      });

      await REGISTRY.connect(buyer).buy(0, {
        value: ethers.utils.parseEther("0.01"),
      });

      await expect(
        REGISTRY.connect(buyer).buy(0, {
          value: ethers.utils.parseEther("0.01"),
        }),
        "DappStopPoP: Already minted!"
      );
    });

    it("should not buy directly from PoP Contract", async function () {
      await REGISTRY.register({
        creator: owner.address,
        popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ",
        ceramicURI:
          "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0o",
        price: ethers.utils.parseEther("0.01"),
      });

      await expect(
        POP.connect(buyer).mint(buyer.address, 0, "0x00", {
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("DappStopPoP: Registry Only");
    });
    it("should update", async function () {
      await REGISTRY.register({
        creator: owner.address,
        popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ",
        ceramicURI:
          "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0o",
        price: ethers.utils.parseEther("0.01"),
      });

      await REGISTRY.update(0, {
        creator: owner.address,
        popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwK",
        ceramicURI:
          "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0p",
        price: ethers.utils.parseEther("0.02"),
      });

      expect(await REGISTRY.getCreator(0)).to.equal(owner.address);
      expect(await REGISTRY.getPoPURI(0)).to.equal(
        "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwK"
      );
      expect(await REGISTRY.getCeramicURI(0)).to.equal(
        "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0p"
      );
      expect(await REGISTRY.getPrice(0)).to.equal(
        ethers.utils.parseEther("0.02")
      );
      expect(await POP.uri(0)).to.equal(
        "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwK"
      );
      // Test if cannot mint with previous price
      await expect(
        REGISTRY.connect(buyer).buy(0, {
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("DappStopRegistry: Insufficient ETH!");
    });

    it("should not update (invalid creator address)", async function () {
      await REGISTRY.register({
        creator: owner.address,
        popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ",
        ceramicURI:
          "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0o",
        price: ethers.utils.parseEther("0.01"),
      });

      await expect(
        REGISTRY.update(0, {
          creator: ethers.constants.AddressZero,
          popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwK",
          ceramicURI:
            "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0p",
          price: ethers.utils.parseEther("0.02"),
        })
      ).to.be.revertedWith("DappStopRegistry: Invalid creator address!");
    });

    it("should update (invalid popURI)", async function () {
      await REGISTRY.register({
        creator: owner.address,
        popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ",
        ceramicURI:
          "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0o",
        price: ethers.utils.parseEther("0.01"),
      });

      await expect(
        REGISTRY.update(0, {
          creator: owner.address,
          popURI: "",
          ceramicURI:
            "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0p",
          price: ethers.utils.parseEther("0.02"),
        })
      ).to.be.revertedWith("DappStopRegistry: Invalid popURI!");
    });

    it("should update (invalid ceramicURI)", async function () {
      await REGISTRY.register({
        creator: owner.address,
        popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwJ",
        ceramicURI:
          "ceramic://kjzl6cwe1jw1464uromc2h309g4xxslbmrsntbo6f3h9o03pquio33rayr5we0o",
        price: ethers.utils.parseEther("0.01"),
      });

      await expect(
        REGISTRY.update(0, {
          creator: owner.address,
          popURI: "ipfs://QmUXm57kNmkGXeFPskNgXBMxEtHBzfTwrkvDqX1iAVbFwK",
          ceramicURI: "",
          price: ethers.utils.parseEther("0.02"),
        })
      ).to.be.revertedWith("DappStopRegistry: Invalid ceramicURI!");
    });
  });
});
