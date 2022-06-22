const { expect, should, assert } = require("chai");
const { ethers } = require("hardhat");

let fortune;
let owner;

let allAddresses;
let addresses1;
let addresses2;
let addresses3;

let provider;

let metadata_1 =
  "https://gateway.pinata.cloud/ipfs/QmSQ6E5dTgjgVchVdYX4CLfv2SrLWLWMTs7VVYWWqZukHw";
let metadata_2 =
  "https://gateway.pinata.cloud/ipfs/QmW1ySEeL4tDJSa8N3ZT4GZNFbKxeAfZbFGca88N6aqhwZ";
let metadata_array = [metadata_1, metadata_2];

let user1;
let user2;
let operator;

let contractUser1;
let contractUser2;
let contractOperator;

beforeEach(async () => {
  allAddresses = [];
  let signers = await ethers.getSigners();
  provider = signers[0].provider;
  for (i = 0; i < signers.length; i++) {
    allAddresses.push(signers[i].address);
  }
  addresses1 = allAddresses.slice(0, 10);
  addresses2 = allAddresses.slice(11, 16);
  addresses3 = allAddresses.slice(16);

  console.log("before executed.");
  // Use one of those accounts to deploy the contract
  const Fortune = await ethers.getContractFactory("FORTUNEExpeditionTeam2022");
  fortune = await Fortune.deploy();
  await fortune.deployed();
  owner = fortune.signer.address;
  console.log(`Contract Address: ${[fortune.address]}`);
  console.log(`Owner Address: ${[fortune.signer.address]}`);

  user1 = signers[1];
  user2 = signers[12];
  operator = signers[17];

  contractUser1 = fortune.connect(user1);
  contractUser2 = fortune.connect(user2);
  contractOperator = fortune.connect(operator);

  console.log("******************************************************");
});

describe("genericFunctions", function () {
  it("deploys token contract", async () => {
    assert.ok(fortune.address);
  });

  it("Balance of creator = 0", async () => {
    expect(await fortune.balanceOf(owner)).to.equal(0);
  });
});

describe("Negative: nonexistent token", function () {
  it("ownerOf for nonexistent token", async function () {
    for (let i = 1; i <= 30; i++) {
      await expect(fortune.ownerOf(i)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    }
  });
  it("tokenURI for nonexistent token", async function () {
    for (let i = 1; i <= 30; i++) {
      await expect(fortune.tokenURI(i)).to.be.revertedWith(
        "ERC721URIStorage: URI query for nonexistent token"
      );
    }
  });
});

describe("Mint Tokens", function () {
  it("safeMint by non owner is not allowed", async function () {
    await expect(
      contractUser1.safeMint(user2.address, metadata_array[0])
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
  it("safeMint by owner is allowed", async function () {
    await expect(fortune.safeMint(user2.address, metadata_array[0])).to.emit(
      fortune,
      "Transfer"
    );
  });
  it("Burn", async function () {
    await fortune.safeMint(user2.address, metadata_array[0]);
    expect(await fortune.tokenURI(1)).to.be.equal(metadata_array[0]);
    expect(await fortune.balanceOf(user2.address)).to.be.equal(1);
    await expect(fortune.connect(user1).burn(1)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
    await expect(fortune.burn(1)).to.be.emit(fortune, "Transfer");
    expect(await fortune.balanceOf(user2.address)).to.equal(0);
  });
  it("Return Royalty value", async function () {
    await fortune.safeMint(user2.address, metadata_array[0]);
    const royaltyInfo = await fortune.royaltyInfo(1, 100_000_000_000);
    expect(royaltyInfo[0]).to.equal(addresses1[0]);
    expect(royaltyInfo[1]).to.equal(10_000_000_000);
  });

  it("support interface", async () => {
    expect(await fortune.supportsInterface("0x2a55205a")).to.be.true;
    expect(await fortune.supportsInterface("0x80ac58cd")).to.be.true;
    expect(await fortune.supportsInterface("0x5b5e139f")).to.be.true;
  });
});
