/// <reference types="jest" />

import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import path from "node:path";
import { PuppeteerPDFGenerator } from "./PuppeteerPDFGenerator";
import { generatePDF } from "./index";

jest.mock("puppeteer", () => ({
  __esModule: true,
  default: { launch: jest.fn() }
}));

jest.mock("@sparticuz/chromium", () => ({
  __esModule: true,
  default: {
    args: ["--no-sandbox", "--single-process"],
    executablePath: jest.fn()
  }
}));

describe("PuppeteerPDFGenerator", () => {
  const body = "<html><head></head><body>Currículo</body></html>";
  const pdfBytes = new Uint8Array([
    37, 80, 68, 70, 45, 49, 46, 55, 10, 128, 255
  ]);
  const page = {
    setContent: jest.fn(),
    addStyleTag: jest.fn(),
    pdf: jest.fn()
  };
  const browser = {
    newPage: jest.fn(),
    close: jest.fn()
  };
  const launch = jest.mocked(puppeteer.launch);

  beforeEach(() => {
    jest.replaceProperty(process, "env", { ...process.env });
    delete process.env.VERCEL;
    delete process.env.PUPPETEER_EXECUTABLE_PATH;
    jest.resetAllMocks();
    jest.mocked(chromium.executablePath).mockResolvedValue("/tmp/chromium");
    launch.mockResolvedValue(
      browser as unknown as Awaited<ReturnType<typeof puppeteer.launch>>
    );
    browser.newPage.mockResolvedValue(page);
    browser.close.mockResolvedValue(undefined);
    page.setContent.mockResolvedValue(undefined);
    page.addStyleTag.mockResolvedValue(undefined);
    page.pdf.mockResolvedValue(pdfBytes);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("uses the bundled browser on Vercel without a user Chrome cache", async () => {
    process.env.VERCEL = "1";

    const pdf = await new PuppeteerPDFGenerator().generate(body);

    expect(chromium.executablePath).toHaveBeenCalledWith(
      path.join(process.cwd(), "node_modules/@sparticuz/chromium/bin")
    );
    expect(launch).toHaveBeenCalledWith({
      headless: "shell",
      args: chromium.args,
      executablePath: "/tmp/chromium"
    });
    expect(Buffer.from(pdf, "base64")).toEqual(Buffer.from(pdfBytes));
    expect(browser.close).toHaveBeenCalledTimes(1);
  });

  it("preserves an explicitly configured browser on Vercel", async () => {
    process.env.VERCEL = "1";
    process.env.PUPPETEER_EXECUTABLE_PATH = "/usr/bin/chromium";

    await new PuppeteerPDFGenerator().generate(body);

    expect(chromium.executablePath).not.toHaveBeenCalled();
    expect(launch).toHaveBeenCalledWith(
      expect.objectContaining({ headless: true })
    );
  });

  it("preserves extraction errors without trying the missing cached Chrome", async () => {
    process.env.VERCEL = "1";
    const error = new Error("Chromium extraction failed");
    jest.mocked(chromium.executablePath).mockRejectedValueOnce(error);

    await expect(new PuppeteerPDFGenerator().generate(body)).rejects.toBe(
      error
    );

    expect(launch).not.toHaveBeenCalled();
  });

  it("returns the PDF bytes as base64 with the existing default page settings", async () => {
    const pdf = await new PuppeteerPDFGenerator().generate(body);

    expect(Buffer.from(pdf, "base64")).toEqual(Buffer.from(pdfBytes));
    expect(launch).toHaveBeenCalledWith({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    });
    expect(page.pdf).toHaveBeenCalledWith({
      format: "A4",
      landscape: false,
      margin: { top: "0.5cm", right: "0.5cm", bottom: "0.5cm", left: "0.5cm" },
      printBackground: true
    });
    expect(page.addStyleTag).not.toHaveBeenCalled();
    expect(chromium.executablePath).not.toHaveBeenCalled();
    expect(browser.close).toHaveBeenCalledTimes(1);
  });

  it("preserves custom layout and CSS through the generatePDF API", async () => {
    const style = "body { background: #eee; }";

    const pdf = await generatePDF(body, {
      orientation: "landscape",
      format: "Letter",
      border: "1cm",
      style
    });

    expect(Buffer.from(pdf, "base64")).toEqual(Buffer.from(pdfBytes));
    expect(page.setContent).toHaveBeenCalledWith(body, { waitUntil: "load" });
    expect(page.addStyleTag).toHaveBeenCalledWith({ content: style });
    expect(page.addStyleTag.mock.invocationCallOrder[0]).toBeLessThan(
      page.pdf.mock.invocationCallOrder[0]
    );
    expect(page.pdf).toHaveBeenCalledWith({
      format: "Letter",
      landscape: true,
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
      printBackground: true
    });
    expect(browser.close).toHaveBeenCalledTimes(1);
  });

  it.each(["newPage", "setContent", "addStyleTag", "pdf"] as const)(
    "closes the browser and preserves the original error when %s fails",
    async (step) => {
      const error = new Error(`${step} failed`);
      const operation = step === "newPage" ? browser.newPage : page[step];
      operation.mockRejectedValueOnce(error);

      await expect(
        new PuppeteerPDFGenerator().generate(body, {
          style: "body { color: black; }"
        })
      ).rejects.toBe(error);

      expect(browser.close).toHaveBeenCalledTimes(1);
    }
  );

  it("preserves browser startup errors", async () => {
    const error = new Error("Chrome could not start");
    launch.mockRejectedValueOnce(error);

    await expect(new PuppeteerPDFGenerator().generate(body)).rejects.toBe(
      error
    );

    expect(browser.newPage).not.toHaveBeenCalled();
    expect(browser.close).not.toHaveBeenCalled();
  });
});
