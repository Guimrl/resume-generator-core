import { readCSSFile } from '../utils'
import { generatePDF } from '../index'
import { DataInfo, PrincipalCVGenerator } from './types'
import path from 'node:path'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const formatMonthYear = (date?: Date): string => {
  if (!date) return ''
  const formatted = format(date, 'LLLL yyyy', { locale: ptBR })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export class PricipalCVPDF implements PrincipalCVGenerator {
  private readonly style: string = readCSSFile(path.resolve(__dirname, 'style.css'))

  async template(data: DataInfo): Promise<string> {
    const { person, address } = data
    const templateStructure = /*html*/ `
    <html>
      <head></head>
      <body>
        <div class="header">
          <h2>${person.name}</h2>
          <h3>${person.position}</h3>  
        </div>
        <div class="columns-row">
          <div class="left-info">
            <p>${person.age} anos</p>
            <p>${address.zip} ${address.neighborhood}, ${address.city} - ${address.state}</p>
            <p>${person.email}</p>
            <p>${person.phone}</p>
          </div>
          <div class="right-info">
            <a href="${person.portfolio}">Portfolio: ${person.portfolio}</a>
            <a href="${person.github}">GitHub: ${person.github}</a>
            <a href="${person.linkedin}">LinkedIn: ${person.linkedin}</a>
          </div>
        </div>
        <div style="clear: both;"></div>
        <div class="section">
          <h2>Conhecimento Técnico</h2>
        </div>
        <div class="section">
          <h2>Formação Acadêmica</h2>
          ${person.education
            .map(
              e =>
                /*html*/ `<p><b>${e.major}</b> | ${e.university} (${e.isGraduated ? 'Concluído' : 'Em andamento'}, ${
                  e.isGraduated ? formatMonthYear(e.completionDate ?? undefined) : formatMonthYear(e.expectedGraduation)
                })</p>`
            )
            .join('')}
        </div>
        <div class="section">
          <h2>Cursos Complementares</h2>
        </div>
        <div class="section">
          <h2>Idiomas</h2>
          <p>${person.language.map(language => language.name + ': ' + language.level).join(', ')}</p>
        </div>
        <div class="section">
          <h2>Experiência Profissional</h2>
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
