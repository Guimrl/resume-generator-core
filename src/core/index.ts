import htmlPdf from "html-pdf";

const phantomjs = require("phantomjs-prebuilt") as { path?: string };

export type PDFOptions = {
  orientation?: "portrait" | "landscape";
  format?: "A4" | "Letter";
  border?: string;
  style?: string;
};

export const generatePDF = (
  body: string,
  options: PDFOptions
): Promise<string> => {
  const { orientation = "portrait", format = "A4", border, style } = options;

  const template = style
    ? body.replace("</head>", `<style>${style}</style>\n</head>`)
    : body;

  return new Promise((resolve, reject) => {
    try {
      const pdfOptions: Record<string, unknown> = {
        border: border || "0.5cm",
        format: format,
        orientation,
        phantomPath: phantomjs.path
      };

      htmlPdf
        .create(template, pdfOptions)
        .toBuffer((err, buffer) => {
          if (err) {
            return reject(
              new Error(
                `Erro ao gerar PDF (html-pdf): ${err.message || String(err)}`
              )
            );
          }

          if (!buffer) {
            return reject(new Error("Não foi possível gerar o buffer do PDF."));
          }

          return resolve(buffer.toString("base64"));
        });
    } catch (error) {
      reject(error);
    }
  });
};