import { PuppeteerPDFGenerator } from "./PuppeteerPDFGenerator";
import { PDFOptions } from "./shared/types/types";

export { PuppeteerPDFGenerator } from "./PuppeteerPDFGenerator";
export type { PDFOptions } from "./shared/types/types";

const pdfGenerator = new PuppeteerPDFGenerator();

export const generatePDF = (
  body: string,
  options: PDFOptions = {}
): Promise<string> => pdfGenerator.generate(body, options);
