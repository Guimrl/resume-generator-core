import puppeteer from "puppeteer";
import { PDFOptions } from "./shared/types/types";
import { PDFGenerator } from "./shared/types/interfaces";

export class PuppeteerPDFGenerator implements PDFGenerator {
  async generate(body: string, options: PDFOptions = {}): Promise<string> {
    const { orientation = "portrait", format = "A4", border, style } = options;
    const margin = border || "0.5cm";
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    try {
      const page = await browser.newPage();
      await page.setContent(body, { waitUntil: "load" });

      if (style) {
        await page.addStyleTag({ content: style });
      }

      const pdf = await page.pdf({
        format,
        landscape: orientation === "landscape",
        margin: { top: margin, right: margin, bottom: margin, left: margin },
        printBackground: true
      });

      return Buffer.from(pdf).toString("base64");
    } finally {
      await browser.close();
    }
  }
}
