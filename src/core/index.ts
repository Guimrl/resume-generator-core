import { PDFOptions, PuppeteerPDFGenerator } from "./PuppeteerPDFGenerator";

export { PDFOptions, PuppeteerPDFGenerator } from "./PuppeteerPDFGenerator";

const pdfGenerator = new PuppeteerPDFGenerator();

export const generatePDF = (
  body: string,
  options: PDFOptions = {}
): Promise<string> => pdfGenerator.generate(body, options);
