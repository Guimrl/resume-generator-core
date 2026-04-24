import { readCSSFile } from '../utils'
import { generatePDF } from '../index'
import { DataInfo, PrincipalCVGenerator } from './types'
import path from 'node:path'

export class PricipalCVPDF implements PrincipalCVGenerator {
  private readonly style: string = readCSSFile(path.resolve(__dirname, 'style.css'))

  async template(data: DataInfo): Promise<string> {
    const { person } = data
    const templateStructure = /*html*/ `
    <html>
      <head></head>
      <body>
        <div>
          <h2>${person.name}</h2>
          <h3>${person.position}</h3>  
        </div>
        <div>
          <div>
            <p>${person.age} anos</p>
            <p>${person.address.zip} ${person.address.neighborhood}, ${person.address.city} - ${person.address.state}</p>
            <p>${person.email}</p>
            <p>${person.phone}</p>
          </div>
          <div>
            <a href="${person.portfolio}">Portfolio: ${person.portfolio}</a>
            <a href="${person.github}">GitHub: ${person.github}</a>
            <a href="${person.linkedin}">LinkedIn: ${person.linkedin}</a>
          </div>
        </div>
      </body>
    </html>`

    return templateStructure
  }

  async generate(data: DataInfo): Promise<string> {
    try {
      const template = await this.template(data)

      return generatePDF(template, {
        orientation: 'portrait',
        format: 'A4',
        border: '0.5cm',
        style: this.style
      })
    } catch (error) {
      console.log(error)
      throw new Error('Erro ao gerar PDF (html-pdf)')
    }
  }
}
