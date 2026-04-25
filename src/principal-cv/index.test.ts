import { PricipalCVPDF } from './PrincipalCV'
import { DataInfo } from './types'
import fs from 'fs'

describe('deve gerar um pdf', () => {
  it('template', async () => {
    const data: DataInfo = {
      personal: {
        name: 'John Doe',
        age: 30,
        position: 'Desenvolvedor Full Stack'
      },
      contact: {
        email: 'john.doe@example.com',
        phone: '+55 11 99999-9999',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        portfolio: 'https://johndoe.dev'
      },
      address: {
        street: 'Av. Paulista',
        number: 1000,
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        neighborhood: 'Bela Vista',
        zip: '01310-100'
      },
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
          name: 'Pipelines de Desenvolvimento e CI/CD',
          institution: 'Microsoft Learn',
          completionDate: new Date('2025-09-28'),
          isCompleted: false,
          duration: '12h'
        },
        {
          name: 'React Avançado',
          institution: 'Plataforma de Cursos',
          completionDate: new Date('2024-02-28'),
          isCompleted: true,
          duration: '40h'
        },
        {
          name: 'Dominando Node.js',
          institution: 'Udemy',
          completionDate: new Date('2025-02-28'),
          isCompleted: true,
          duration: '8h'
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
          company: 'Google',
          position: 'Desenvolvedor Full Stack',
          companyResume:
            'O Gmail, seu principal produto de correio eletrônico lançado em 2004, é um serviço de webmail seguro',
          startDate: new Date('2022-01-01'),
          endDate: new Date('2024-03-31'),
          isCurrent: false,
          description: ['Desenvolvimento de aplicações web usando TypeScript, React e Node.js.']
        },
        {
          company: 'Amazon Web Services LTDA',
          position: 'Desenvolvedor Full Stack Senior',
          companyResume:
            'multinacional que abrange comércio eletrônico, computação em nuvem, streaming digital e inteligência artificial',
          startDate: new Date('2026-01-01'),
          endDate: null,
          isCurrent: true,
          description: [
            'Desenvolvimento de aplicações web usando TypeScript, React e Node.js.',
            'Deploy e Integração com CI/CD',
            'Resolução de chamados',
            'Responsavel por realizar mentoria interna'
          ]
        }
      ],
      skills: [{ name: 'TypeScript' }, { name: 'React' }, { name: 'Node.js' }]
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
