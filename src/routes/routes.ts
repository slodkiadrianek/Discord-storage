import e from "express";
import { concatFiles } from "../controller/concat.js";
import { splitPDF, splitTXT } from "../controller/split.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/path/to/save/uploads");
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

export default router;
