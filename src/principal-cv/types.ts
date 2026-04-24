export type DataInfo = {
  person: PersonalInfo
}

export type PersonalInfo = {
  name: string
  age: number
  position: string
  address: {
    street: string
    number: number
    city: string
    state: string
    country: string
    neighborhood: string
    zip: string
  }
  email: string
  phone: string
  linkedin: string
  github: string
  portfolio: string
  education: {
    university: string
    major: string
    completionDate: Date
    expectedGraduation: Date
    isGraduated: boolean
  }[]
  courses: {
    name: string
    institution: string
    completionDate: Date
    isCompleted: boolean
  }[]
  language: {
    name: string
    level: string
  }
  experience: {
    company: string
    position: string
    startDate: Date
    endDate: Date
    isCurrent: boolean
    description: string
  }[]
  skills: {
    name: string
    level: string
  }[]
}

export interface PrincipalCVGenerator {
  template(data: DataInfo): Promise<string>
  generate(data: DataInfo): Promise<string>
}
