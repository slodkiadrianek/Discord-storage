import path from "path";
import fs from "fs";
import { fetchData } from "../model/discord.js";
import { concatPDF, concatTXT, sortFiles } from "../model/concat.js";
export const concatFiles = async (req, res) => {
    const { threadId, type } = req.body;
    // Fetch data from Discord
    await fetchData(threadId);
    // Get the list of files in the "src/uploads" directory
    const files = fs.readdirSync("src/uploads");
    // Sort the files in ascending order
    const sortedFiles = sortFiles(files);
    // Create an array of file paths
    const filePaths = sortedFiles.map((file) => `src/uploads/${file}`);
    // Set the name for the concatenated file
    const name = "concat";
    // Get the current directory path
    const __dirname = path.resolve();
    let fileToDownload = "";
    // Concatenate the files and save the concatenated file
    if (type === "txt") {
        await concatTXT(filePaths, "./output", name);
        fileToDownload = path.join(__dirname, `./output/${name}.txt`);
    }
    if (type === "pdf") {
        await concatPDF(filePaths, "./output", name);
        fileToDownload = path.join(__dirname, `./output/${name}.pdf`);
    }
    return res.download(fileToDownload);
};
