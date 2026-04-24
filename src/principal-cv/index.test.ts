import { PricipalCVPDF } from './PrincipalCV'
import { DataInfo } from './types'
import fs from 'fs'

describe('deve gerar um pdf', () => {
  it('template', async () => {
    const data: DataInfo = {
      person: {
        name: 'John Doe',
        age: 30,
        position: 'Desenvolvedor Full Stack',
        email: 'john.doe@example.com',
        phone: '+55 11 99999-9999',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        portfolio: 'https://johndoe.dev',
        education: [
          {
            university: 'Universidade de São Paulo',
            major: 'Engenharia de Software',
            completionDate: new Date('2023-12-15'),
            expectedGraduation: new Date('2023-12-15'),
            isGraduated: true
          },
          {
            university: 'Anhanguera',
            major: 'Mestrado em Redes',
            completionDate: null,
            expectedGraduation: new Date('2027-12-15'),
            isGraduated: false
          }
        ],
        courses: [
          {
            name: 'React Avançado',
            institution: 'Plataforma de Cursos',
            completionDate: new Date('2024-02-28'),
            isCompleted: true
          }
        ],
        language: [
          {
            name: 'Inglês',
            level: 'Avançado'
          },
          {
            name: 'Espanhol',
            level: 'Intermediário'
          }
        ],
        experience: [
          {
            company: 'Empresa Exemplo',
            position: 'Desenvolvedor Full Stack',
            startDate: new Date('2022-01-01'),
            endDate: new Date('2024-03-31'),
            isCurrent: false,
            description: 'Desenvolvimento de aplicações web usando TypeScript, React e Node.js.'
          }
        ],
        skills: [
          { name: 'TypeScript', level: 'Avançado' },
          { name: 'React', level: 'Avançado' },
          { name: 'Node.js', level: 'Intermediário' }
        ]
      },
      address: {
        street: 'Av. Paulista',
        number: 1000,
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        neighborhood: 'Bela Vista',
        zip: '01310-100'
      }
    }

    const dependency = new PricipalCVPDF()
    const pdf = await dependency.generate(data)

    await new Promise((resolve, reject) => {
      fs.writeFile('src/principal-cv/principalCV.pdf', pdf, { encoding: 'base64' }, err => {
        if (err) {
          reject(err)
        }
        resolve(true)
      })
    })
  })
})
