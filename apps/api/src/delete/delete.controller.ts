import { Controller, Get, Param } from '@nestjs/common';
import { ROUTES } from '../lib/constants';
import { DeleteService } from './delete.service';

@Controller(ROUTES.DELETE)
export class DeleteController {
  constructor(private readonly deleteService: DeleteService) {}

  @Get(':token')
  async delete(@Param() { token }: { token: string }) {
    const file = await this.deleteService.findFile(token);
    if (!file) return { success: false, message: 'File not found' };
    const success = await this.deleteService.deleteFile(token, file.slug);
    return {
      success,
      message: success ? 'File deleted' : 'Error deleting file',
    };
  }
}
