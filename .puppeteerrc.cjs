/** @type {import("puppeteer").Configuration} */
module.exports = {
  // Vercel uses the Chromium binary bundled by @sparticuz/chromium.
  skipDownload: process.env.VERCEL === "1"
};
