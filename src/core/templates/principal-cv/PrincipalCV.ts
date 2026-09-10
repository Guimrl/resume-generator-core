import { formatDate, formatMonthYear, readCSSFile } from "../../shared/utils";
import { PuppeteerPDFGenerator } from "../../index";
import {
  CoursesInfo,
  DataInfo,
  EducationInfo,
  ExperienceInfo,
  LanguageInfo,
  PrincipalCVGenerator,
  SkillsInfo
} from "./types";
import path from "node:path";

export class PricipalCVPDF implements PrincipalCVGenerator {
  private readonly style: string = readCSSFile(
    path.resolve(__dirname, "style.css")
  );

  constructor(private readonly pdfGenerator = new PuppeteerPDFGenerator()) {}

  async template(data: DataInfo): Promise<string> {
    const {
      personal,
      address,
      contact,
      education,
      courses,
      language,
      experience,
      skills
    } = data;

    const getSkills = (skills: SkillsInfo[]) => {
      return skills
        .map((skill) => /*html*/ `<span><b>${skill.name}</b></span>`)
        .join(" | ");
    };

    const getEducation = (education: EducationInfo[]) => {
      return education
        .map(
          (e) =>
            /*html*/ `<p><b>${e.major}</b> | ${e.university} (${e.isGraduated ? "Concluído" : "Em andamento"}, ${e.isGraduated
              ? formatMonthYear(e.completionDate ?? undefined)
              : formatMonthYear(e.expectedGraduation)
            })</p>`
        )
        .join("");
    };

    const getCourses = (courses: CoursesInfo[]) => {
      return courses
        .map((course) => {
          const completionDate =
            course.completionDate instanceof Date
              ? course.completionDate
              : course.completionDate
                ? new Date(course.completionDate)
                : null;

          const year = completionDate?.getFullYear?.() ?? "";
          const label = course.isCompleted ? `${year}` : `Cursando${year ? `, ${year}` : ""}`;

          return /*html*/ `<p>${course.name} - ${course.institution} (${course.duration}, ${label})</p>`;
        })
        .join("");
    };

    const getLanguage = (language: LanguageInfo[]) => {
      return language
        .map((l) => /*html*/ `<span><b>${l.name}</b>: ${l.level}</span>`)
        .join(", ");
    };

    const getExperience = (experience: ExperienceInfo[]) => {
      return experience
        .map(
          (exp) => /*html*/ `
            <p class="new-line"><b>${exp.position}</b> (${formatDate(exp.startDate)} - ${exp.isCurrent
              ? "Atualmente"
              : formatDate(exp.endDate ?? undefined)
            })</p>
            <p class="new-line">${exp.company} | <i>${exp.companyResume}</i></p>
            <ul class="new-line">
              ${exp.description.map((desc) => /*html*/ `<li class="gap">- ${desc}</li>`).join("")}
            </ul>
          `
        )
        .join("");
    };

    const templateStructure = /*html*/ `
    <html>
      <head></head>
      <body>
        <div class="header">
          <h2>${personal.name}</h2>
          <h3>${personal.position}</h3>  
        </div>
        <div class="section">
          <div class="left-info">
            <p>${personal.age} anos</p>
            <p>${address.zip} ${address.neighborhood}, ${address.city} - ${address.state}</p>
            <p>${contact.email}</p>
            <p>${contact.phone}</p>
          </div>
          <div class="right-info">
            
            <a href="${contact.portfolio}">Portfolio: ${contact.portfolio}</a>
            <a href="${contact.github}">GitHub: ${contact.github}</a>
            <a href="${contact.linkedin}">LinkedIn: ${contact.linkedin}</a>
          </div>
        </div>
        <div style="clear: both;" class="section"></div>
        <div class="section">
          <h2>Conhecimento Técnico</h2>
          <div class="middle-info">${getSkills(skills)}</div>
        </div>
        <div class="section">
          <h2>Formação Acadêmica</h2>
          ${getEducation(education)}
        </div>
        <div class="section">
          <h2>Cursos Complementares</h2>
          ${getCourses(courses)}
        </div>
        <div class="section">
          <h2>Idiomas</h2>
          <p>${getLanguage(language)}</p>
        </div>
        <div class="section">
          <h2>Experiência Profissional</h2>
          ${getExperience(experience)}
        </div>
        </div>
      </body>
    </html>`;

    return templateStructure;
  }

  async generate(data: DataInfo): Promise<string> {
    const template = await this.template(data);

    return this.pdfGenerator.generate(template, {
      orientation: "portrait",
      format: "A4",
      border: "1cm",
      style: this.style
    });
  }
}
