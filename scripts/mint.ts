import dotenv from "dotenv";
import { ethers, Wallet } from "ethers";
import FortuneTeamNFT from "../artifacts/contracts/FortuneTeamNFT.sol/GenesisTeamFortuneHunter.json";
import { provider } from "./ethersReadOnly";

dotenv.config();
const { MNEMONIC, RINKEBY_RPC_URL, MAIN_WALLET, MAINNET_RPC_URL } = process.env;
const contract_address = "0xb50d853b335919042DFFa44Ad726d40155D22c63";
// const contract_address_mainnet = "0xC1C14B1a54F6692bC769b1bd0af7d51F8539E3D9";
const contract_address_mainnet = "0x4B1aE89f5BA54d2F1b74c5eB2f7B8E6A608EB464";

const metadata = [
  "ipfs://bafybeignmaqylkc5qdbcrph5jigrwabn6n6w5vk22wbsd6m2dko6uydm6m/fortune-team-collection.json",
  "ipfs://bafybeiadbt6m635idw5s4cel5whee5fjhwneueyqi4j7tqvzzlej3uzeta/fortune-team-collection.json",
  "ipfs://bafybeidpx5ikvdlyy7rk6c6rpjsig7nsax6nxczogfku7r6k7yoiyfu5ve/fortune-team-collection.json",
];
const FORTUNE_TEAM_WALLET = "0x3F2FC48004eDBf6f972e745140535ac7745752C0";
const mint = async () => {
  const signer = new Wallet(MAIN_WALLET, provider(RINKEBY_RPC_URL));
  const fortuneInstance = new ethers.Contract(
    contract_address,
    FortuneTeamNFT.abi,
    signer
  );

  for (let i = 0; i < metadata.length; i++) {
    const trxn = await fortuneInstance.setTokenURI(i + 1, metadata[i]);
    const completed_tx = await trxn.wait();
    console.log({ events: completed_tx.events[0]?.args });
  }
};

mint()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
