import { Files, Fields } from 'formidable';

export interface UploadDto {
  fields: Fields;
  files: Files;
}