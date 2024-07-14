import express from "express";
import { verifyJWT } from "../../middlewares/jwtTokenVerification";
import multer from "multer";
import {
  uploadDocument,
  getDocumentsByUser,
  deleteDocument,
} from "./documentcontroller";
import path from "path";

const documentRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const filetypes = /jpeg|jpg|png|pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Unsupported file type"));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

documentRouter.post(
  "/upload",
  verifyJWT,
  upload.single("document"),
  uploadDocument
);
documentRouter.get("/user/:userId", verifyJWT, getDocumentsByUser);
documentRouter.delete("/:documentId", verifyJWT, deleteDocument);

export default documentRouter;
