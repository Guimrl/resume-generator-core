import puppeteer from "puppeteer";
import { PDFOptions } from "./shared/types/types";
import { PDFGenerator } from "./shared/types/interfaces";

export class PuppeteerPDFGenerator implements PDFGenerator {
  async generate(body: string, options: PDFOptions = {}): Promise<string> {
    const { orientation = "portrait", format = "A4", border, style } = options;
    const margin = border || "0.5cm";
    const isVercel = Boolean(process.env.VERCEL);
    const chromium = isVercel ? await import("@sparticuz/chromium") : undefined;
    const executablePath = chromium
      ? await chromium.default.executablePath()
      : undefined;
    const browser = await puppeteer.launch({
      headless: true,
      args: chromium
        ? chromium.default.args
        : ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath
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
