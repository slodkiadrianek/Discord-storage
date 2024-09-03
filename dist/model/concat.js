import fs from "fs/promises";
import { createWriteStream } from "fs";
import { PDFDocument } from "pdf-lib";
export async function concatPDF(filePaths, outdir, filename) {
    const writeStream = createWriteStream(`${outdir}/${filename}.pdf`, {
        encoding: "utf-8",
    });
    const newPdf = await PDFDocument.create();
    for (const filePath of filePaths) {
        const existingPdfBytes = await fs.readFile(filePath);
        const bufferData = Buffer.from(existingPdfBytes);
        const pdfDoc = await PDFDocument.load(bufferData);
        const pageCount = pdfDoc.getPageCount();
        for (let i = 0; i < pageCount; i++) {
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
            newPdf.addPage(copiedPage);
        }
    }
    const pdfBytes = await newPdf.save();
    writeStream.write(pdfBytes);
    writeStream.on("finish", () => {
        console.log(`Files concatenated`);
        writeStream.end();
    });
}
export async function concatTXT(filePaths, outdir, filename) {
    const writeStream = createWriteStream(`${outdir}/${filename}.txt`, {
        encoding: "utf-8",
    });
    let data = "";
    for (const filePath of filePaths) {
        console.log(filePath);
        const chunk = await fs.readFile(filePath);
        data += chunk.toString();
    }
    writeStream.write(data);
    writeStream.on("finish", () => {
        console.log(`Files concatenated`);
        writeStream.end();
    });
}
export function sortFiles(files) {
    return files.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });
}
