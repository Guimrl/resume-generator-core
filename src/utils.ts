import fs from 'node:fs'
import path from 'node:path'
import { format } from 'date-fns'

export const readCSSFile = (filePath: string): string => {
  return fs.readFileSync(path.resolve(filePath), 'utf-8')
}

export const formatDate = (date?: Date): string => {
  if (!date) return ''
  return format(date, 'MM/yyyy')
}
