export type DataInfo = {
  personal: PersonalInfo
  contact: ContactInfo
  address: AddressInfo
  education: Array<EducationInfo>
  courses: Array<CoursesInfo>
  language: Array<LanguageInfo>
  experience: Array<ExperienceInfo>
  skills: Array<SkillsInfo>
}
export type PersonalInfo = {
  name: string
  age: number
  position: string
}
export type ContactInfo = {
  email: string
  phone: string
  linkedin: string
  github: string
  portfolio: string
}
export type AddressInfo = {
  street: string
  number: number
  city: string
  state: string
  country: string
  neighborhood: string
  zip: string
}
export type EducationInfo = {
  university: string
  major: string
  completionDate: Date | null
  expectedGraduation: Date
  isGraduated: boolean
}
export type CoursesInfo = {
  name: string
  institution: string
  duration: string
  completionDate: Date
  isCompleted: boolean
}
export type LanguageInfo = {
  name: string
  level: string
}
export type ExperienceInfo = {
  company: string
  position: string
  companyResume: string
  startDate: Date
  endDate: Date | null
  isCurrent: boolean
  description: string[]
}
export type SkillsInfo = { name: string }

export interface PrincipalCVGenerator {
  template(data: DataInfo): Promise<string>
  generate(data: DataInfo): Promise<string>
}
