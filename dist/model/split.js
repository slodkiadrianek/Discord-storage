import fs from "fs/promises";
import { createWriteStream } from "fs";
import { PDFDocument } from "pdf-lib";
import path from "path";
export async function splitPdf(file, outdir, filename) {
    const existingPdfBytes = await fs.readFile(file);
    const bufferData = Buffer.from(existingPdfBytes);
    const pdfDoc = await PDFDocument.load(bufferData);
    const pagesPerChunk = 40;
    const fileNames = [];
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i += pagesPerChunk) {
        const newPdf = await PDFDocument.create();
        for (let a = i; a < i + pagesPerChunk; a++) {
            if (a >= pageCount)
                break;
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [a]);
            newPdf.addPage(copiedPage);
        }
        fileNames.push(`${outdir}/${filename}-${i}.pdf`);
        const pdfBytes = await newPdf.save();
        const writeStream = createWriteStream(`${outdir}/${filename}-${i}.pdf`);
        writeStream.write(pdfBytes);
    }
    return fileNames;
}
export async function splitTxt(file, outdir) {
    const existingPdfBytes = await fs.readFile(file);
    const bufferData = Buffer.from(existingPdfBytes);
    const filename = path.basename(file).replace(".txt", "");
    const chunkSize = 25000000;
    const fileNames = [];
    for (let i = 0; i < bufferData.length; i += chunkSize) {
        fileNames.push(`${outdir}/${filename}-${i}.txt`);
        const writeStream = createWriteStream(`${outdir}/${filename}-${i}.txt`, {
            encoding: "utf-8",
        });
        const newLines = existingPdfBytes.slice(i, i + chunkSize);
        const data = newLines.toString();
        writeStream.write(data);
    }
    return fileNames;
}
