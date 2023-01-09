import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
      secure: true,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<cloudinary.UploadApiResponse | cloudinary.UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        file.path,
        { upload_preset: 'blog_setups', folder, resource_type: 'auto' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );
    });
  }
}
