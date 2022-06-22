import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { File, Web3Storage } from "web3.storage";

dotenv.config();

const { WEB3_STORAGE_TOKEN } = process.env;

function makeStorageClient() {
  return new Web3Storage({ token: WEB3_STORAGE_TOKEN });
}

/**
 * A helper to read a file from a location on disk and return a File object.
 * Note that this reads the entire file into memory and should not be used for
 * very large files.
 * @param {string} filePath the path to a file to store
 * @returns {File} a File object containing the file content
 */
export async function fileFromPath(filePath: string): Promise<File> {
  const content = fs.readFileSync(filePath);
  // const type = mime.(filePath);
  console.log("Base name", path.basename(filePath));
  return new File(
    [content],
    path.basename(filePath) /* , { type: "image/png" } */
  );
}

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePath the path to an image file
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */

export async function storeNFT(
  imagePath: string,
  name: string,
  description: string
) {
  const image = await fileFromPath(imagePath);
  return await storeData({
    image,
    name,
    description,
  });
}

export async function storeData(data: any) {
  // create a new NFTStorage client using our API key
  const nftstorage = makeStorageClient();
  // call client.store, passing in the image & metadata
  return await nftstorage.put(data);
}
