import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ApplicantFactsService } from '../applicant-facts/applicant-facts.service';
import { randomUUID } from 'crypto';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class DocumentsService {
  private readonly BUCKET_NAME = 'documents'; // Change this to your bucket name

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly applicantFactsService: ApplicantFactsService,
  ) {}

  /**
   * Sanitizes a phone number by removing all non-numeric characters
   */
  private sanitizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, '');
  }

  async uploadDocument(
    file: MulterFile,
    fieldId: string,
    phoneNumber: string,
  ): Promise<{ success: boolean; url: string; message: string }> {
    try {
      // Validate file
      if (!file || !file.buffer) {
        throw new BadRequestException('No file provided');
      }

      // Validate field_id and phone_number
      if (!fieldId || !phoneNumber) {
        throw new BadRequestException(
          'field_id and phone_number are required',
        );
      }

      // Sanitize phone number
      const cleanPhoneNumber = this.sanitizePhoneNumber(phoneNumber);

      // Generate unique filename
      const fileExtension = this.getFileExtension(file.mimetype);
      const fileName = `${randomUUID()}.${fileExtension}`;
      const filePath = `${cleanPhoneNumber}/${fieldId}/${fileName}`;

      // Upload to Supabase Storage
      const supabase = this.supabaseService.getClient();
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false, // Don't overwrite existing files
        });

      if (error) {
        throw new Error(`Failed to upload to Supabase: ${error.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(filePath);

      // Save to applicant_facts using the sanitized phone number
      await this.applicantFactsService.create({
        field_id: fieldId,
        value: [publicUrl],
        phone_number: cleanPhoneNumber,
      });

      return {
        success: true,
        url: publicUrl,
        message: 'Document uploaded successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to upload document',
      );
    }
  }

  private getFileExtension(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };

    return mimeToExt[mimeType.toLowerCase()] || 'jpg';
  }
}
