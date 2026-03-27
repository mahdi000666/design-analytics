export type FileType = 'deliverable' | 'reference' | 'brand_guideline';

export interface UploadedFile {
  readonly id:               number;
  readonly uploaded_by:      number;
  readonly uploaded_by_name: string;
  readonly file_url:         string;
  readonly file_size:        number;
  readonly uploaded_at:      string;
  project:   number;
  file_type: FileType;
  file_name: string;
}