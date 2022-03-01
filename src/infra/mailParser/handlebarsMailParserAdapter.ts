import fs from 'fs'
import { resolve } from 'path'
import handlebars from 'handlebars'
import { MailParser } from '@/data/ports/mail/mailParser'

const templatePath = resolve(__dirname, 'templates', 'userCreationEmail.hbs')

export class HandlebarsMailParserAdapter implements MailParser {
  parse (input: string): string {
    const templateVariables = {
      username: input
    }
    const templateFileContent = fs.readFileSync(templatePath).toString('utf-8')
    const templateParse = handlebars.compile(templateFileContent)
    const templateHTML = templateParse(templateVariables)
    return templateHTML
  }
}
