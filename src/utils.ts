import fs from 'node:fs'
import path from 'node:path'

export const readCSSFile = (filePath: string): string => {
  return fs.readFileSync(path.resolve(filePath), 'utf-8')
}
