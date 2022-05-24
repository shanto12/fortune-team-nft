const {expect, should, assert} = require("chai");
const {ethers} = require("hardhat");

let fortune;
let owner;

let allAddresses;
let addresses1;
let addresses2;
let addresses3;

let provider;

let metadata_1 = "https://gateway.pinata.cloud/ipfs/QmSQ6E5dTgjgVchVdYX4CLfv2SrLWLWMTs7VVYWWqZukHw";
let metadata_2 = "https://gateway.pinata.cloud/ipfs/QmW1ySEeL4tDJSa8N3ZT4GZNFbKxeAfZbFGca88N6aqhwZ";
let metadata_array = [metadata_1, metadata_2]

let user1;
let user2;
let operator;


let contractUser1;
let contractUser2;
let contractOperator;

before(async () => {
    allAddresses = [];
    let signers = await ethers.getSigners();
    provider = signers[0].provider;
    for (i = 0; i < signers.length; i++) {
        allAddresses.push(signers[i].address);
    }
    addresses1 = allAddresses.slice(0, 10);
    addresses2 = allAddresses.slice(11, 16);
    addresses3 = allAddresses.slice(16);

    console.log(addresses1)
    console.log(addresses2)
    console.log(addresses3)

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

    console.log('******************************************************');
});

describe("genericFunctions", function () {
    it('deploys token contract', async () => {
        assert.ok(fortune.address);
    });
    it("getMintedCount", async function () {
        expect(await fortune.getMintedCount()).to.equal(0);
    });
    it('Balance of creator = 0', async () => {
        expect(await fortune.balanceOf(owner)).to.equal(0);
    });
});

describe("Negative: nonexistent token", function () {
    it("ownerOf for nonexistent token", async function () {
        for (let i = 1; i <= 30; i++) {
            await expect(fortune.ownerOf(i)).to.be.revertedWith('ERC721: owner query for nonexistent token');
        }
    });
    it("tokenURI for nonexistent token", async function () {
        for (let i = 1; i <= 30; i++) {
            await expect(fortune.tokenURI(i)).to.be.revertedWith('ERC721URIStorage: URI query for nonexistent token');
        }
    });
    it("setURI for nonexistent token", async function () {
        for (let i = 1; i <= 30; i++) {
            await expect(fortune.setURI(i, "test")).to.be.revertedWith('ERC721URIStorage: URI set of nonexistent token');
        }
    });
});

describe("Mint Tokens", function () {
    it("safeMint by non owner is not allowed", async function () {
        for (let i = 1; i <= 2; i++) {
            await expect(contractUser1.safeMint(user2.address, metadata_array[i - 1])).to.be.revertedWith('You are not the owner to call this function');
        }
    });
    it("safeMint by owner is allowed", async function () {
        for (let i = 1; i <= 2; i++) {
            await expect(fortune.safeMint(user2.address, metadata_array[i - 1])).to.be.ok;
        }
    });
    it("tokenURI", async function () {
        for (let i = 1; i <= 2; i++) {
            console.log(i)
            expect(await fortune.tokenURI(i-1)).to.be.equal(metadata_array[i-1]);
        }
    });
    it("balanceOf token owner", async function () {
        expect(await fortune.balanceOf(user2.address)).to.be.equal(2);
    });
    it("balanceOf non token owner", async function () {
        expect(await fortune.balanceOf(user1.address)).to.be.equal(0);
    });
});


describe("URI", function () {
    it("safeMint by owner", async function () {
        for (let i = 1; i <= 2; i++) {
            await expect(fortune.safeMint(user2.address, metadata_array[i - 1])).to.be.ok;
        }
    });
    let token_uri="tokenURI"
    it("setURI for all tokens by owner", async function () {
        for (let i = 1; i <= 2; i++) {
            expect(await fortune.setURI(i-1, token_uri));
        }
    });

    it("tokenURI", async function () {
        for (let i = 1; i <= 2; i++) {
            expect(await fortune.tokenURI(i-1)).to.be.equal(token_uri);
        }
    });
    it("setURI for all tokens by non owner", async function () {
        for (let i = 1; i <= 2; i++) {
            await expect(contractUser1.setURI(i-1, token_uri)).to.be.revertedWith("You are not the owner to call this function");
        }
    });
});

describe("burn Token", function () {
    it("safeMint by owner", async function () {
        for (let i = 1; i <= 2; i++) {
            await expect(fortune.safeMint(user2.address, metadata_array[i - 1])).to.be.ok;
        }
    });

    it("Burn by non owner", async function () {
        for (let i = 1; i <= 2; i++) {
            await expect(contractUser1.burn(i-1)).to.be.revertedWith("ERC721Burnable: caller is not owner nor approved");
        }
    });
    it("balanceOf token owner before burn", async function () {
        expect(await fortune.balanceOf(user2.address)).to.be.equal(2);
    });
    it("Burn by owner", async function () {
        for (let i = 1; i <= 2; i++) {
            await expect(contractUser2.burn(i-1)).to.be.ok;
        }
    });
});


describe("transfer Token", function () {
    it("safeMint by owner", async function () {
        for (let i = 1; i <= 2; i++) {
            await expect(fortune.safeMint(user2.address, metadata_array[i - 1])).to.be.ok;
        }
    });

    it("Burn by non owner", async function () {
        for (let i = 1; i <= 2; i++) {
            await expect(contractUser1.burn(i-1)).to.be.revertedWith("ERC721Burnable: caller is not owner nor approved");
        }
    });
    it("balanceOf token owner before burn", async function () {
        expect(await fortune.balanceOf(user2.address)).to.be.equal(2);
    });
    it("Burn by owner", async function () {
        for (let i = 1; i <= 2; i++) {
            await expect(contractUser2.burn(i-1)).to.be.ok;
        }
    });
});

