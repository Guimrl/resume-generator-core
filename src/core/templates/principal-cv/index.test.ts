import { PricipalCVPDF } from "./PrincipalCV";
import { DataInfo } from "./types";
import { writeFile } from "node:fs/promises";
import path from "node:path";

describe("deve gerar um pdf", () => {
  it("template", async () => {
    const data: DataInfo = {
      personal: {
        name: "Guilherme Santos do Amaral",
        age: 24,
        position: "Desenvolvedor Full Stack"
      },
      contact: {
        email: "gui.amaral123@outlook.com",
        phone: "+55 51 9 8951-5251",
        linkedin: "https://linkedin.com/in/guimrl",
        github: "https://github.com/guimrl",
        portfolio: "https://guimrl.github.io/"
      },
      address: {
        street: null,
        number: null,
        city: "Canoas",
        state: "RS",
        country: "Brasil",
        neighborhood: "Fátima",
        zip: "92200-770"
      },
      education: [
        {
          university: "Anhanguera",
          major: "Pós Graduação em Engenharia de Software",
          completionDate: new Date("2025-01-02"),
          expectedGraduation: new Date("2026-01-01"),
          isGraduated: true
        },
        {
          university: "Estácio de Sá",
          major: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
          completionDate: new Date("2023-12-02"),
          expectedGraduation: new Date("2023-12-02"),
          isGraduated: true
        }
      ],
      courses: [
        {
          name: "Curso Web API ASP .NET Core Essencial (.NET 8 / .NET 9)",
          institution: "José Carlos Macoratti",
          completionDate: new Date("2026-08-28"),
          isCompleted: true,
          duration: "47h"
        },
        {
          name: "Estruturas de Dados e Algoritmos",
          institution: "Augusto Galego",
          completionDate: new Date("2025-02-28"),
          isCompleted: true,
          duration: "8h"
        },
        {
          name: "Formação Comunicação",
          institution: "Alura",
          completionDate: new Date("2023-02-28"),
          isCompleted: true,
          duration: "49h"
        },
        {
          name: "Formação TypeScript",
          institution: "Alura",
          completionDate: new Date("2023-02-28"),
          isCompleted: true,
          duration: "31h"
        },
        {
          name: "Formação JavaScript para Front End",
          institution: "Alura",
          completionDate: new Date("2022-02-28"),
          isCompleted: true,
          duration: "60h"
        },
        {
          name: "Desenvolvimento Web Full Stack",
          institution: "Udemy",
          completionDate: new Date("2022-02-28"),
          isCompleted: true,
          duration: "114h"
        }
      ],
      language: [
        {
          name: "Inglês",
          level: "Intermediário"
        },
        {
          name: "Espanhol",
          level: "Intermediário"
        }
      ],
      experience: [
        {
          company: "GVdasa",
          position: "Desenvolvedor Front End Pleno",
          companyResume:
            "HUB de gestão educacional, ERP e portais para instituições de ensino.",
          startDate: new Date("2026-01-02"),
          endDate: null,
          isCurrent: true,
          description: [
            "Desenvolvimento e integração de Micro-frontends dentro de um ecossistema complexo, permitindo a evolução isolada dos portais de Professor, Aluno e Avaliações sem impactar a estabilidade global do sistema.",
            "Criação de novas funcionalidades e correções em React com TypeScript, utilizando React Query para gerenciamento eficiente de estados assíncronos e cache de dados, otimizando a comunicação com as APIs.",
            "Manutenção e correção de rotas em Web API, resolvendo falhas de integração e garantindo a consistência no fluxo de dados entre o back-end e as aplicações do portal.",
            "Revisão e aprovação de pull requests garantindo os padrões arquiteturais e de qualidade de código estabelecidos pela equipe, com gestão de deploys em produção suportada por processos de integração e entrega contínuas(CI/CD)",
            "Diagnóstico e resolução de chamados técnicos de clientes, transformando feedbacks em melhorias contínuas de UX e correções de bugs."
          ]
        },
        {
          company: "Workupy",
          position: "Desenvolvedor Full Stack Pleno",
          companyResume:
            "Plataforma de desenvolvimento para criação de sites aplicativos usando no-code",
          startDate: new Date("2025-09-02"),
          endDate: new Date("2026-01-02"),
          isCurrent: false,
          description: [
            "Corrigi bugs utilizando React e TypeScript que impactavam diretamente a experiência do usuário, incluindo falhas em funcionalidades como Undo/Redo, Copiar/Colar, duplicação de elementos e responsividade em telas menores.",
            "Desenvolvi novos componentes para o editor visual da plataforma e realizei múltiplos ajustes na interface, corrigindo inconsistências de alinhamento, espaçamento, cores, transparência de elementos e funcionamento de inputs e sliders, garantindo uma experiência de edição mais fluida.",
            "Garanti que as propriedades de estilo (largura, bordas, margens) aplicadas no editor fossem refletidas corretamente no site final da aplicação em produção, resolvendo discrepâncias de renderização."
          ]
        },
        {
          company: "Decision Systems",
          position: "Desenvolvedor Full Stack",
          companyResume: "Sistema de gestão backoffice, ERP, CRM",
          startDate: new Date("2023-07-02"),
          endDate: new Date("2025-09-02"),
          isCurrent: false,
          description: [
            "Desenvolvimento de resolvers GraphQL integrando bancos SQL com TypeScript.",
            "Estruturação e evolução de APIs GraphQL, definindo schemas, typedefs e resolvers alinhados às regras de negócio.",
            "Aumento significativo na eficiência de consultas ao banco de dados com a introdução de Dataloaders para otimização de queries.",
            "Implementação de esteiras de validação de dados utilizando Zod, garantindo consistência, segurança de tipagem e integridade das informações trafegadas.",
            "Integração de serviços externos, APIs de pagamento, autenticação.",
            "Criação de testes unitários com Jest e validações usando práticas de TDD para assegurar a qualidade do código.",
            "Desenvolvimento de hooks reutilizáveis.",
            "Criação de relatórios em PDF utilizando TypeScript e HTML para documentação e apresentação de dados.",
            "Otimizações e correções de bugs em aplicações front-end com TypeScript.",
            "Construção de dashboards interativos no front-end para visualização de métricas e dados em tempo real",
            "Implementação de interfaces em React com foco em UX e Refatoração de código e implementação de soluções eficientes para otimização de processos e automações."
          ]
        }
      ],
      skills: []
    };

    const dependency = new PricipalCVPDF();
    const pdf = await dependency.generate(data);

    const document = Buffer.from(pdf, "base64");
    expect(document.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(document.toString("base64")).toBe(pdf);

    await writeFile(path.resolve(__dirname, "principalCV.pdf"), document);
  }, 30_000);
});
