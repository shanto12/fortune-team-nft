import path from "path";
import { Blob, File } from "web3.storage";
import { fileFromPath, storeData } from "./helper";
import fs from "fs";
import csvParser from "csv-parser";

const images = fs.readdirSync("./images").map((elem) => `./images/${elem}`);

const nft_ipfs_cids: any[] = [];
let results: any[] = [];
const makeNFTMetadata = async (attributes: any[]) => {
  console.log({ attributes, results });

  for (let index = 0; index < images.length; index++) {
    const imgPath = images[index];

    const description =
      "The Fortune Hunter is your key to enter the P2E Metaverse. A collection of 10,000 hunters comprised of men and women from across the globe searching for answers, competing for treasure, and discovering the secrets left behind by The Travelers. There is a hunter in each of us.";

    const avatar = await fileFromPath(imgPath);
    const avatarCid = await storeData([avatar]);
    const data = {
      image: `ipfs://${avatarCid}/${path.basename(imgPath)}`,
      name: `Genesis Team Fortune Hunter #${[index + 1]}`,
      description,
      attributes: attributes[index],
    };
    console.log("data :>> ", data);
    const blobJson = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    const jsonFile = new File([blobJson], `fortune-team-collection.json`);
    const cid = await storeData([jsonFile]);
    nft_ipfs_cids.push(`ipfs://${cid}/fortune-team-collection.json`);
  }
  console.log({ nft_ipfs_cids });
};

function get_attributes() {
  const path = "./scripts/Genesis_Fortune_Hunter_METADATA_Sheet1.csv";
  try {
    fs.createReadStream(path)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        results = results.map((res: any) => {
          let obj = Object.entries(res).map((elem: any) => {
            if (elem[0] === "Birthday") {
              return {
                display_type: "date",
                trait_type: elem[0],
                value: Math.floor(new Date(elem[1]).getTime() / 1000.0),
              };
            }
            if (elem[0] === "Health") {
              return {
                display_type: "boost_number",
                max_value: 350,
                trait_type: elem[0],
                value: +elem[1],
              };
            }
            if (
              elem[0] === "Supply Burn Rate" ||
              elem[0] === "Gear Burn Rate"
            ) {
              return {
                max_value: 3,
                trait_type: elem[0],
                value: +elem[1],
              };
            }
            if (elem[0] === "Earn Rate") {
              return {
                max_value: 8,
                trait_type: "Base Earn Rate (BER)",
                value: +elem[1],
              };
            }

            return {
              trait_type: elem[0],
              value: elem[1],
            };
          });
          obj = [
            ...obj,
            {
              display_type: "boost_number",
              max_value: 150,
              trait_type: "Water Search Speed",
              value: 130,
            },
            {
              display_type: "boost_number",
              max_value: 150,
              trait_type: "Land Search Speed",
              value: 130,
            },
          ].filter(
            (elem) => elem.value !== "-" && elem.trait_type !== "Team Member"
          );

          return obj;
        });
        await makeNFTMetadata(results);
      });
    return results;
  } catch (error) {
    console.error(error);
  }
}
get_attributes();