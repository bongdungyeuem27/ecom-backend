import multer from "multer";
export const upload = multer({
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

