import fs from "fs/promises";
import { createWriteStream } from "fs";
import { PDFDocument } from "pdf-lib";
import path from "path";

export async function splitPdf(
  file: string,
  outdir: string,
  filename: string
): Promise<string[]> {
  const existingPdfBytes: any = await fs.readFile(file);
  const bufferData = Buffer.from(existingPdfBytes);
  const pdfDoc = await PDFDocument.load(bufferData);
  const pagesPerChunk = 40;

  const fileNames: string[] = [];
  const pageCount = pdfDoc.getPageCount();
  for (let i = 0; i < pageCount; i += pagesPerChunk) {
    const newPdf = await PDFDocument.create();

    for (let a = i; a < i + pagesPerChunk; a++) {
      if (a >= pageCount) break;
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

export async function splitTxt(
  file: string,
  outdir: string
): Promise<string[]> {
  const existingPdfBytes: any = await fs.readFile(file);
  const bufferData = Buffer.from(existingPdfBytes);
  const filename = path.basename(file).replace(".txt", "");
  const chunkSize = 25000000;
  const fileNames: string[] = [];

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
