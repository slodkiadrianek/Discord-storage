import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createThreadInChannel } from "../model/discord.js";
import { splitPdf, splitTxt } from "../model/split.js";

// Define a custom interface extending the Express Request interface
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

/**
 * Split a PDF file and upload the split pages to Discord channel.
 * @param req - The Express request object with Multer file.
 * @param res - The Express response object.
 * @returns A response indicating the success of the operation.
 */
export const splitPDF = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  const file = req.file;
  const filename = file?.filename;
  const name: any = filename?.split(".")[0];
  const __dirname = path.resolve();
  const ext = path.join(__dirname, `src/uploads/${filename}`);

  // Split the PDF file
  const result = await splitPdf(ext, "./output", name);

  // Create a thread in the Discord channel
  await createThreadInChannel(name, result);

  // Remove the split pages from the output directory
  const files = fs.readdirSync("./output");
  for (const file of files) {
    fs.unlinkSync(`./output/${file}`);
  }

  // Remove the uploaded file from the uploads directory
  const uploadedFiles = fs.readdirSync("src/uploads");
  for (const file of uploadedFiles) {
    fs.unlinkSync(`./src/uploads/${file}`);
  }

  return res.send("PDF file uploaded and split successfully");
};

/**
 * Split a TXT file and upload the split pages to Discord channel.
 * @param req - The Express request object with Multer file.
 * @param res - The Express response object.
 * @returns A response indicating the success of the operation.
 */
export const splitTXT = async (req: Request, res: Response) => {
  const file: any = req.file;
  const filename = file.filename;
  const name = filename.split(".")[0];

  // Split the TXT file

  const __dirname = path.resolve();
  const ext = path.join(__dirname, `src/uploads/${filename}`);
  const result = await splitTxt(ext, "./output");
  await createThreadInChannel(name, result);
  const files = fs.readdirSync("./output");
  for (const file of files) {
    fs.unlinkSync(`./output/${file}`);
  }
  const uploadedFiles = fs.readdirSync("src/uploads");
  for (const file of uploadedFiles) {
    fs.unlinkSync(`./src/uploads/${file}`);
  }
  return res.redirect("/");
};
