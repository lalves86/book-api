import { MailParser } from '@/data/ports/mail/mailParser'

export class MailParserStub implements MailParser {
  parse (input: string): string {
    return '<p>' + input + '</p>'
  }
}
