import multer, { FileFilterCallback, Multer } from "multer";
import { Request, Response, NextFunction } from "express";

class MulterConfig {
  private acceptType: string[];

  constructor(acceptType: string[]) {
    this.acceptType = acceptType;
  }

  private storage = multer.diskStorage({
    // Define the destination folder for uploaded files
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      // Generate a unique filename for the uploaded file
      const currentTime = Date.now() + '_' + Math.round(Math.random() * 1E90);
      cb(null, `${file.fieldname}_${currentTime}.${file.mimetype.split('/')[1]}`);
    }
  });

  private fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Check if the file mimetype is in the accepted types
    if (this.acceptType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  public getUploadMiddleware(): Multer {
     // Return the configured multer middleware
    return multer({ storage: this.storage, fileFilter: this.fileFilter, dest: '/uploads' });
  }
}

class ErrorHandler {
  public static handle(err: any, req: Request, res: Response, next: NextFunction): void {
    // Handle any multer errors
    if (err) {
      res.status(400).json({ message: 'multer error', err });
    } else {
      next();
    }
  }
}
// Define the accepted validation types and exporting them to be used in Product router
export const validationTypes = {
  image: ['image/png', 'image/jpg', 'image/jpeg']
};
// Export the error handler middleware to be used in Product router
export const HME = ErrorHandler.handle;
// Export the custom multer middleware generator function to be used in Product router
export const myMulter = (acceptType: string[]): Multer => {
  const multerConfig = new MulterConfig(acceptType);
  return multerConfig.getUploadMiddleware();
};