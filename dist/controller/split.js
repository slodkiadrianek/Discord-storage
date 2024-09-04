import path from "path";
import { createThreadInChannel } from "../model/discord.js";
import { splitPdf, splitTxt } from "../model/split.js";
/**
 * Split a PDF file and upload the split pages to Discord channel.
 * @param req - The Express request object with Multer file.
 * @param res - The Express response object.
 * @returns A response indicating the success of the operation.
 */
export const splitPDF = async (req, res) => {
    const file = req.file;
    const filename = file?.filename;
    const name = filename?.split(".")[0];
    const __dirname = path.resolve();
    const ext = path.join(__dirname, `src/uploads/${filename}`);
    // Split the PDF file
    const result = await splitPdf(ext, "./output", name);
    // Create a thread in the Discord channel
    await createThreadInChannel(name, result);
    return res.send("PDF file uploaded and split successfully");
};
/**
 * Split a TXT file and upload the split pages to Discord channel.
 * @param req - The Express request object with Multer file.
 * @param res - The Express response object.
 * @returns A response indicating the success of the operation.
 */
export const splitTXT = async (req, res) => {
    const file = req.file;
    const filename = file.filename;
    const name = filename.split(".")[0];
    // Split the TXT file
    const __dirname = path.resolve();
    const ext = path.join(__dirname, `src/uploads/${filename}`);
    const result = await splitTxt(ext, "./output");
    await createThreadInChannel(name, result);
    return res.redirect("/");
};
