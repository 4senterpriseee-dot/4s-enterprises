import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PVT_KEY,
});

export async function uploadFile({buffer, fileName, folder = "E-commerce"}) {
  try {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder,
    });

    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function deleteFile(fileId) {
  try {
    if (!fileId) return;
    const result = await client.deleteFile(fileId);
    return result;
  } catch (error) {
    console.error(`Error deleting file ${fileId}:`, error);
    // don't throw, just log so we don't break product update
  }
}