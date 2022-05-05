import { Controller, Get, Param } from '@nestjs/common';
import { ROUTES } from '../lib/constants';
import { DeleteService } from './delete.service';

@Controller(ROUTES.DELETE)
export class DeleteController {
  constructor(private readonly deleteService: DeleteService) {}

  @Get(':token')
  delete(@Param() { token }: { token: string }) {
    return process.env.USE_S3 === 'true'
      ? this.deleteService.deleteFileFromS3(token)
      : this.deleteService.deleteFile(token);
  }
}
