
export interface IFormFile {
  contentType?: string;
  contentDisposition?: string;
  headers: Record<string, string[]> | undefined;
  length: number;
  name?: string;
  fileName?: string;
}
