const { expect, should, assert } = require("chai");
const { ethers } = require("hardhat");
const { utils } = ethers
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

const domain = (verifyingContract) => ({
  name: "Genesis Team Fortune Hunter",
  version: "1.0.1",
  chainId: 31337,
  verifyingContract,
});

const types = {
  SafeMintWithSig: [
    { name: "to", type: "address" },
    { name: "tokenId", type: "uint256" },
    { name: "uri", type: "string" },
    { name: "nonce", type: "uint256" },
  ],
};
const metadata =
  "ipfs://bafybeiei2m6wpjky3i5m3qod3xd2tpxnk4jnqsbimlr5ou2imbmnqplc44/rattler-nft.json";

let user1;
let user2;
let operator;

let contractUser1;
let contractUser2;
let contractOperator, signers;

beforeEach(async () => {
  allAddresses = [];
  signers = await ethers.getSigners();
  provider = signers[0].provider;
  for (let i = 0; i < signers.length; i++) {
    allAddresses.push(signers[i].address);
  }
  addresses1 = allAddresses.slice(0, 10);
  addresses2 = allAddresses.slice(11, 16);
  addresses3 = allAddresses.slice(16);

  console.log("before executed.");
  // Use one of those accounts to deploy the contract
  const Fortune = await ethers.getContractFactory("GenesisTeamFortuneHunter");
  fortune = await Fortune.deploy(addresses1[0]);
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
      contractUser1.safeMint(user2.address, 1, metadata_array[0])
    ).to.be.revertedWith('not minter');
  });
  it("safeMint by owner is allowed", async function () {
    await expect(fortune.safeMint(user2.address, 1, metadata_array[0])).to.emit(
      fortune,
      "Transfer"
    );
  });

  it("mintWithSig", async () => {
    const value = {
      to: user2.address,
      tokenId: 1,
      uri: metadata,
      nonce: 1,
    };
    const signer = signers[0]
    console.log({ isMinter: await fortune.isMinter(signer.address) })
    const signature = await signer._signTypedData(
      domain(fortune.address),
      types,
      value
    );
    const { v, r, s } = utils.splitSignature(signature);
    console.log({ v, r, s });
    const txn = await fortune.safeMintWithSig(
      signer.address,
      value.to,
      value.tokenId,
      value.uri,
      v,
      r,
      s
    );
    await txn.wait();
    console.log({
      transactionHash: `${txn.hash}`,
    });
  })
  it("Burn", async function () {
    await fortune.safeMint(user2.address, 1, metadata_array[0]);
    expect(await fortune.tokenURI(1)).to.be.equal(metadata_array[0]);
    expect(await fortune.balanceOf(user2.address)).to.be.equal(1);
    await expect(fortune.connect(user1).burn(1)).to.be.revertedWith(
      'not minter'
    );
    await expect(fortune.burn(1)).to.be.emit(fortune, "Transfer");
    expect(await fortune.balanceOf(user2.address)).to.equal(0);
  });
  it("Return Royalty value", async function () {
    await fortune.safeMint(user2.address, 1, metadata_array[0]);
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
