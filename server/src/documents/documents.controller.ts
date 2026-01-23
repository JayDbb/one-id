import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { DocumentsService } from './documents.service';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Controller('upload-documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image'))
  async uploadDocument(
    @UploadedFile() file: MulterFile,
    @Req() request: Request,
  ): Promise<{ success: boolean; url: string; message: string }> {
    // Get field_id and phone_number from form data
    // In multipart/form-data, these come through request.body
    const fieldId = request.body?.field_id;
    const phoneNumber = request.body?.phone_number;

    if (!fieldId || !phoneNumber) {
      throw new BadRequestException(
        'field_id and phone_number are required in form data',
      );
    }

    if (!file) {
      throw new BadRequestException('image file is required');
    }

    return this.documentsService.uploadDocument(file, fieldId, phoneNumber);
  }
}
