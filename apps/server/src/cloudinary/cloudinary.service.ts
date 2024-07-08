import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'stream';
@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve) => {
      const upload = cloudinary.uploader.upload_stream((error, result) => {
        if (error) throw new InternalServerErrorException(error);
        resolve(result);
      });

      Readable.from(file.buffer).pipe(upload);
    });
  }
}
