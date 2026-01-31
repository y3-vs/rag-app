import { FileAttachment } from '@/app/types';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_FILE_TYPES = {
  documents: ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export interface FileValidationError {
  code: 'INVALID_TYPE' | 'FILE_TOO_LARGE' | 'READ_ERROR';
  message: string;
}

export class FileHandler {
  static isValidFileType(file: File): boolean {
    const allAllowedTypes = [...ALLOWED_FILE_TYPES.documents, ...ALLOWED_FILE_TYPES.images];
    return allAllowedTypes.includes(file.type);
  }

  static isValidFileSize(file: File): boolean {
    return file.size <= MAX_FILE_SIZE;
  }

  static getFileType(file: File): 'document' | 'image' | null {
    if (ALLOWED_FILE_TYPES.documents.includes(file.type)) {
      return 'document';
    }
    if (ALLOWED_FILE_TYPES.images.includes(file.type)) {
      return 'image';
    }
    return null;
  }

  static validateFile(file: File): FileValidationError | null {
    if (!this.isValidFileType(file)) {
      return {
        code: 'INVALID_TYPE',
        message: `File type not supported. Allowed types: PDF, TXT, DOCX, JPEG, PNG, GIF, WebP`,
      };
    }

    if (!this.isValidFileSize(file)) {
      return {
        code: 'FILE_TOO_LARGE',
        message: `File size exceeds 25MB limit. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      };
    }

    return null;
  }

  static async processFile(file: File): Promise<FileAttachment> {
    const validationError = this.validateFile(file);
    if (validationError) {
      throw new Error(validationError.message);
    }

    const fileType = this.getFileType(file);
    if (!fileType) {
      throw new Error('Unable to determine file type');
    }

    let content: string | undefined;

    try {
      if (fileType === 'image') {
        content = await this.readImageAsBase64(file);
      } else if (fileType === 'document') {
        content = await this.readDocumentContent(file);
      }
    } catch (error) {
      throw {
        code: 'READ_ERROR',
        message: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }

    return {
      id: uuidv4(),
      filename: file.name,
      type: fileType,
      size: file.size,
      content,
    };
  }

  private static readImageAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        resolve(result); // Returns data:image/...;base64,...
      };

      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };

      reader.readAsDataURL(file);
    });
  }

  private static readDocumentContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const content = reader.result as string;
          resolve(content);
        } catch (error) {
          reject(new Error('Failed to parse document content'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read document file'));
      };

      // Read as text for TXT, plain text fallback for others
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
        // Note: For PDF parsing, consider adding a library like pdfjs-dist in the future
      }
    });
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default FileHandler;
