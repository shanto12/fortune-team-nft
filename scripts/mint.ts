import dotenv from "dotenv";
import { ethers, Wallet } from "ethers";
import FortuneTeamNFT from "../artifacts/contracts/FortuneTeamNFT.sol/GenesisTeamFortuneHunter.json";
import { provider } from "./ethersReadOnly";

dotenv.config();
const { MNEMONIC, RINKEBY_RPC_URL, MAIN_WALLET, MAINNET_RPC_URL } = process.env;
const contract_address = "0x70767c7e17A4A075121Df2F23C0A8e532B5C21e6";
// const contract_address_mainnet = "0xC1C14B1a54F6692bC769b1bd0af7d51F8539E3D9";
const contract_address_mainnet = "0x4B1aE89f5BA54d2F1b74c5eB2f7B8E6A608EB464";

const metadata = [
  "ipfs://bafybeifqjq3exvjke5lxjqvlvs3ii4mlgkydugtej2gg5tohiug3epcawa/fortune-team-collection.json",
  "ipfs://bafybeic2xkjmtaac4lahthddwd726varxiqqtpxnmfclchwxwmho4otk2i/fortune-team-collection.json",
  "ipfs://bafybeicts5sfarsmasguzc74q5jpqbwtzsyj6pqrz3g3fb5xvfgdp2upuu/fortune-team-collection.json",
];
const FORTUNE_TEAM_WALLET = "0x3F2FC48004eDBf6f972e745140535ac7745752C0";
const mint = async () => {
  const signer = new Wallet(MAIN_WALLET, provider(MAINNET_RPC_URL));
  const FortuneTeamNFTContract = new ethers.ContractFactory(
    FortuneTeamNFT.abi,
    FortuneTeamNFT.bytecode
  );
  const fortuneInstance = FortuneTeamNFTContract.attach(
    contract_address_mainnet
  ).connect(signer);
  for (let i = 0; i < metadata.length; i++) {
    const trxn = await fortuneInstance.safeMint(
      FORTUNE_TEAM_WALLET,
      metadata[i]
    );
    const completed_tx = await trxn.wait();
    console.log({ events: completed_tx.events[0].args });
  }
};

mint()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
