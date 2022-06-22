import dotenv from "dotenv";
import { ethers, Wallet } from "ethers";
import FortuneTeamNFT from "../artifacts/contracts/FortuneTeamNFT.sol/FORTUNEExpeditionTeam2022.json";
import { provider } from "./ethersReadOnly";

dotenv.config();
const { MNEMONIC, RINKEBY_RPC_URL } = process.env;
const contract_address = "0x153D41f00063870Df477f36f48FDc4fEBB21Ef19";
const metadata = [
  "ipfs://bafybeiezmdhcdfjqrd3pmnwckhblghuh6xxswdpqapsfixjzj4v3vmuns4/fortune-team-collection.json",
  "ipfs://bafybeichyj3fvxefl7rx36uhhffg56pfh2rdxtv35lbwh5z5f5hnzmbjcq/fortune-team-collection.json",
  "ipfs://bafybeig3irioxfqtcowavajqoafx5yr7quhcs5zzp7kldvtvn7jpyl75ve/fortune-team-collection.json",
];
const mint = async () => {
  const wallet = Wallet.fromMnemonic(MNEMONIC);
  const signer = wallet.connect(provider(RINKEBY_RPC_URL));
  const FortuneTeamNFTContract = new ethers.ContractFactory(
    FortuneTeamNFT.abi,
    FortuneTeamNFT.bytecode
  );
  const fortuneInstance =
    FortuneTeamNFTContract.attach(contract_address).connect(signer);
  for (let i = 0; i < metadata.length; i++) {
    const trxn = await fortuneInstance.safeMint(signer.address, metadata[i]);
    const completed_tx = await trxn.wait();
    console.log({ events: completed_tx.events });
  }
};

mint();
