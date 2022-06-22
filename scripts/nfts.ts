import path from "path";
import { Blob, File } from "web3.storage";
import { fileFromPath, storeData } from "./helper";
const names = ["Barry", "Hiryu", "Daftknowd"];
const attributes = [
  [
    {
      trait_type: "Name",
      value: "Barry",
    },
    {
      display_type: "date",
      trait_type: "Birthday",
      value: 1640998861,
    },
    {
      trait_type: "Class",
      value: "Legendary",
    },
    {
      trait_type: "Generation",
      value: "Genesis",
    },
    {
      trait_type: "Background",
      value: "Blue/Peach Grid",
    },
    {
      display_type: "boost_number",
      trait_type: "Health",
      value: 150,
    },
    {
      trait_type: "Supply Burn Rate",
      value: 0.75,
    },
    {
      trait_type: "Gear Burn Rate",
      value: 0.8,
    },
    {
      trait_type: "Earn Rate",
      value: 5,
    },
    {
      trait_type: "Sex",
      value: "Male",
    },
    {
      trait_type: "Hair Style",
      value: "Bald",
    },
    {
      trait_type: "Facial Hair",
      value: "Trimmed Beard",
    },
    {
      trait_type: "Hair Color",
      value: "Red",
    },
    {
      trait_type: "Skin",
      value: "Caucasian",
    },
    {
      trait_type: "Tattoo",
      value: "None",
    },
    {
      trait_type: "Teeth",
      value: "Normal",
    },
    {
      trait_type: "Eyes",
      value: "Black",
    },
    {
      trait_type: "Facial Expression",
      value: "Resting",
    },
    {
      trait_type: "Headwear",
      value: "Blue Baseball Cap",
    },
    {
      trait_type: "Ears",
      value: "None",
    },
    {
      trait_type: "Eyewear",
      value: "Black Glasses",
    },
    {
      trait_type: "Coat",
      value: "None",
    },
    {
      trait_type: "Top",
      value: "Race Driver Suit",
    },
    {
      trait_type: "Neck",
      value: "None",
    },
    {
      trait_type: "Accessory",
      value: "None",
    },
    {
      trait_type: "Gear",
      value: "Blue Field Pack",
    },
    {
      trait_type: "Right Hand",
      value: "Lightsaber",
    },
    {
      trait_type: "Left Hand",
      value: "None",
    },
    {
      trait_type: "Back",
      value: "None",
    },
  ],
  [
    {
      trait_type: "Name",
      value: "Hiryu",
    },
    {
      display_type: "date",
      trait_type: "Birthday",
      value: 1648083661,
    },
    {
      trait_type: "Class",
      value: "Legendary",
    },
    {
      trait_type: "Generation",
      value: "Genesis",
    },
    {
      trait_type: "Background",
      value: "Blue/Peach Ring",
    },
    {
      display_type: "boost_number",
      trait_type: "Health",
      value: 150,
    },
    {
      trait_type: "Supply Burn Rate",
      value: 0.75,
    },
    {
      trait_type: "Gear Burn Rate",
      value: 0.8,
    },
    {
      trait_type: "Earn Rate",
      value: 5,
    },
    {
      trait_type: "Sex",
      value: "Male",
    },
    {
      trait_type: "Hair Style",
      value: "Short",
    },
    {
      trait_type: "Facial Hair",
      value: "None",
    },
    {
      trait_type: "Hair Color",
      value: "Black",
    },
    {
      trait_type: "Skin",
      value: "Caucasian",
    },
    {
      trait_type: "Tattoo",
      value: "None",
    },
    {
      trait_type: "Teeth",
      value: "Normal",
    },
    {
      trait_type: "Eyes",
      value: "Zombie",
    },
    {
      trait_type: "Facial Expression",
      value: "Resting",
    },
    {
      trait_type: "Headwear",
      value: "None",
    },
    {
      trait_type: "Ears",
      value: "None",
    },
    {
      trait_type: "Eyewear",
      value: "None",
    },
    {
      trait_type: "Coat",
      value: "None",
    },
    {
      trait_type: "Top",
      value: "Black Hoodie",
    },
    {
      trait_type: "Neck",
      value: "None",
    },
    {
      trait_type: "Accessory",
      value: "None",
    },
    {
      trait_type: "Gear",
      value: "Red Spiked Field Pack",
    },
    {
      trait_type: "Right Hand",
      value: "None",
    },
    {
      trait_type: "Left Hand",
      value: "None",
    },
    {
      trait_type: "Back",
      value: "Bat Wings",
    },
  ],
  [
    {
      trait_type: "Name",
      value: "Daftknowd",
    },
    {
      display_type: "date",
      trait_type: "Birthday",
      value: 1648947661,
    },
    {
      trait_type: "Class",
      value: "Legendary",
    },
    {
      trait_type: "Generation",
      value: "Genesis",
    },
    {
      trait_type: "Background",
      value: "Gold Sonar",
    },
    {
      display_type: "boost_number",
      trait_type: "Health",
      value: 150,
    },
    {
      trait_type: "Supply Burn Rate",
      value: 0.75,
    },
    {
      trait_type: "Gear Burn Rate",
      value: 0.8,
    },
    {
      trait_type: "Earn Rate",
      value: 5,
    },
    {
      trait_type: "Sex",
      value: "Male",
    },
    {
      trait_type: "Hair Style",
      value: "Short",
    },
    // {
    //   trait_type: "Facial Hair",
    //   value: "None",
    // },
    // {
    //   trait_type: "Hair Color",
    //   value: "Black",
    // },
    {
      trait_type: "Skin",
      value: "Caucasian",
    },
    {
      trait_type: "Tattoo",
      value: "None",
    },
    {
      trait_type: "Teeth",
      value: "Normal",
    },
    // {
    //   trait_type: "Eyes",
    //   value: "Zombie",
    // },
    // {
    //   trait_type: "Facial Expression",
    //   value: "Resting",
    // },
    {
      trait_type: "Headwear",
      value: "Daft Helmet",
    },
    // {
    //   trait_type: "Ears",
    //   value: "None",
    // },
    // {
    //   trait_type: "Eyewear",
    //   value: "None",
    // },
    {
      trait_type: "Coat",
      value: "Black Leather Jacket",
    },
    {
      trait_type: "Top",
      value: `"R" Tee`,
    },
    {
      trait_type: "Neck",
      value: "None",
    },
    {
      trait_type: "Accessory",
      value: "None",
    },
    {
      trait_type: "Gear",
      value: "Gold Field Pack",
    },
    {
      trait_type: "Right Hand",
      value: "Fortune Medallion",
    },
    {
      trait_type: "Left Hand",
      value: "None",
    },
    {
      trait_type: "Back",
      value: "None",
    },
  ],
];
const images = [
  "./images/peter.png",
  "./images/alexander.png",
  "./images/ryan.png",
];

const nft_ipfs_cids: any[] = [
  {
    peter_metadata:
      "https://ipfs.io/ipfs/bafybeibz73i7hbl63gsvmgxg54q7qaalxf66n7ptqvmnroc2v45ql3zr54/fortune-team-collection.json",

    peter_image:
      "https://ipfs.io/ipfs/bafybeiai4nkjnrxvs6avnumrniupgn2qhrthfe7lahdqw7zokz6nmsnqpu/peter.png",
  },
  {
    alex_metadata:
      "https://ipfs.io/ipfs/bafybeiauuj3etzsdzuge23zv347iusgtlwmqu3r3xe4t3sdwknms7aalh4/fortune-team-collection.json",

    alex_image:
      "https://ipfs.io/ipfs/bafybeibigm6fz4ad4rfniiorycuabo6wgxryonfxjv7dwk6us3g5emh4ze/alexander.png",
  },
  {
    ryan_metadata:
      "https://ipfs.io/ipfs/bafybeiboekpngavuemvl2zgcbzni2lwy3mdy6vrsh656gikec7pd3nte7a/fortune-team-collection.json",

    ryan_image:
      "https://ipfs.io/ipfs/bafybeicv7bo4cyebxc3smrpnkt4yo2x5rubki7nbswpee7q5wmyu5fxnt4/ryan.png",
  },
];

const makeNFTMetadata = async () => {
  for (let index = 0; index < images.length; index++) {
    const imgPath = images[index];

    const description =
      "The Fortune Hunter is your key to enter the P2E Metaverse. A collection of 10,000 hunters comprised of men and women from across the globe searching for answers, competing for treasure, and discovering the secrets left behind by The Travelers. There is a hunter in each of us.";

    const avatar = await fileFromPath(imgPath);
    const avatarCid = await storeData([avatar]);
    const data = {
      image: `ipfs://${avatarCid}/${path.basename(imgPath)}`,
      name: names[index],
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
makeNFTMetadata();

// export {};
