import { ConfigOptions, v2 } from 'cloudinary';
import { ConfigurationService } from '../configuration/configuration.service';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  inject: [ConfigurationService],
  useFactory: (config: ConfigurationService): ConfigOptions => {
    return v2.config({
      cloud_name: config.get('CLOUDINARY_CLOUDNAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_SECRET'),
    });
  },
};
