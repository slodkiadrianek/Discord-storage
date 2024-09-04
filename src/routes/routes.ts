import e, { Request, Response } from "express";
import { concatFiles } from "../controller/concat.js";
import { splitPDF, splitTXT } from "../controller/split.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = e.Router();

router.post("/auth/pdf", upload.single("pdf"), splitPDF);
router.post("/auth/txt", upload.single("txt"), splitTXT);
router.post("/auth/concat", concatFiles);
router.get("/", (req: Request, res: Response) => {
  const __dirname = path.resolve();

  const uploadedFiles = fs.readdirSync("src/uploads");
  for (const file of uploadedFiles) {
    fs.unlinkSync(`./src/uploads/${file}`);
  }
  // Delete the uploaded files from the "src/uploads" directory

  // Get the list of files in the "../output" directory
  const outputedFiles = fs.readdirSync(__dirname + "/output");

  // The code is incomplete and does not handle the outputedFiles array
  for (const file of outputedFiles) {
    fs.unlinkSync(`./output/${file}`);
  }
  res.render("index");
});
router.get("/pdf", (req: Request, res: Response) => {
  res.render("splitPDF");
});
router.get("/txt", (req: Request, res: Response) => {
  res.render("splitTXT");
});
router.get("/concat", (req: Request, res: Response) => {
  res.render("concat");
});

export default router;
