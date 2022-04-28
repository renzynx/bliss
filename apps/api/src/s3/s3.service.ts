import { Injectable } from '@nestjs/common';
import { S3, Endpoint, Credentials } from 'aws-sdk';

@Injectable()
export class S3Service {
  private readonly s3 =
    process.env.USE_S3 &&
    new S3({
      region: process.env.S3_REGION,
      s3ForcePathStyle: true,
      endpoint: new Endpoint(process.env.S3_ENDPOINT),
      credentials: new Credentials({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      }),
    });

  s3_upload(bucket: string, file: Express.Multer.File, slug: string) {
    const params: S3.PutObjectRequest = {
      Bucket: bucket,
      Key: slug + '.' + file.originalname.split('.').pop(),
      Body: file.buffer,
      ACL: 'public-read',
      ContentLength: file.size,
      ContentType: file.mimetype,
    };

    return this.s3.upload(params).promise();
  }

  s3_delete(filename: string, bucket: string) {
    const params: S3.DeleteObjectRequest = {
      Bucket: bucket,
      Key: filename,
    };

    return this.s3.deleteObject(params).promise();
  }
}
