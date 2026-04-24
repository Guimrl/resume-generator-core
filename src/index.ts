import htmlPdf from 'html-pdf'
import fs from 'node:fs'
import path from 'node:path'

export type PDFOptions = {
  orientation?: 'portrait' | 'landscape'
  format?: 'A4' | 'Letter'
  border?: string
  style?: string
}

export const generatePDF = (body: string, options: PDFOptions): Promise<string> => {
  const { orientation = 'portrait', format = 'A4', border, style } = options

  const template = style ? body.replace('</head>', `<style>${style}</style>\n</head>`) : body

  return new Promise((resolve, reject) => {
    htmlPdf
      .create(template, {
        border: border || '0.5cm',
        format: format,
        orientation
      })
      .toBuffer((err, buffer) => {
        if (err) {
          return reject(new Error('Erro ao gerar PDF (html-pdf)'))
        }

        return resolve(buffer.toString('base64'))
      })
  })
}
