import { PDFOptions } from "./types";

export interface PDFGenerator {
  generate(body: string, options: PDFOptions): Promise<string>;
}
