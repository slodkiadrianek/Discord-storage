import multer from "multer";
import e, { Request, Response } from "express";
import { splitPdf, splitTxt } from "./model/split.js";
import path from "path";
import {
  client,
  BOT_TOKEN,
  createThreadInChannel,
  fetchData,
} from "./model/discord.js";
import { concatTXT, concatPDF } from "./model/concat.js";
import fs from "fs";

const app = e();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads");
  },
  filename: function (req, file, cb) {
    const filename = file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

app.use(
  e.urlencoded({
    extended: true,
  })
);

app.post(
  "/auth/pdf",
  upload.single("pdf"),
  async (req: Request, res: Response) => {
    const file: any = req.file;
    const filename = file.filename;
    const name = filename.split(".")[0];
    const __dirname = path.resolve();
    const ext = path.join(__dirname, `src/uploads/${filename}`);
    const result = await splitPdf(ext, "./output", name);
    await createThreadInChannel(name, result);
    const files = fs.readdirSync("./output");
    for (const file of files) {
      fs.unlinkSync(`./output/${file}`);
    }
    const uploadedFiles = fs.readdirSync("src/uploads");
    for (const file of uploadedFiles) {
      fs.unlinkSync(`./src/uploads/${file}`);
    }
    return res.send("PDF file uploaded and split successfully");
  }
);
app.post(
  "/auth/txt",
  upload.single("txt"),
  async (req: Request, res: Response) => {
    const file: any = req.file;
    const filename = file.filename;
    const name = filename.split(".")[0];
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
    return res.send("TXT file uploaded and split successfully");
  }
);

app.post(
  "/auth/txt/concat",
  upload.array("txt", 30),
  async (req: Request, res: Response) => {
    const files: any = req.files;
    const filePaths = files.map((file: any) => file.path);
    console.log(filePaths);
    const name = "concat";
    await concatTXT(filePaths, "./output", name);
    const uploadedFiles = fs.readdirSync("src/uploads");
    for (const file of uploadedFiles) {
      fs.unlinkSync(`./src/uploads/${file}`);
    }
    const __dirname = path.resolve();

    const ext = path.join(__dirname, `./output/${name}.txt`);
    return res
      .send("TXT files  concatenated successfully")
      .download(`./output/${name}.txt`);
  }
);
app.post(
  "/auth/pdf/concat",
  upload.array("pdf", 30),
  async (req: Request, res: Response) => {
    const files: any = req.files;
    const filePaths = files.map((file: any) => file.path);
    console.log(filePaths);
    const name = "concat";
    await concatPDF(filePaths, "./output", name);
    const uploadedFiles = fs.readdirSync("src/uploads");
    for (const file of uploadedFiles) {
      fs.unlinkSync(`./src/uploads/${file}`);
    }
    const __dirname = path.resolve();

    const ext = path.join(__dirname, `./output/${name}.pdf`);
    return res.download(ext, (err) => {
      if (err) {
        console.log(err);
      }
    });
    // .send("TXT files  concatenated successfully")
  }
);

app.post("/auth/fetch", async (req: Request, res: Response) => {
  const data = await fetchData("1280184239131852810");
  console.log(data);
  return res.json(data);
});

app.listen(3300, () => {
  console.log(`Server is running on port 3300`);
  client.once("ready", () => {
    console.log(`BOT IS ONLINE`);
  });

  client.login(BOT_TOKEN);
});
