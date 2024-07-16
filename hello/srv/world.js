import cds from '@sap/cds'
export class say extends cds.ApplicationService {
  hello (to = 'World') {
    return `Hello ${to}!`
  }
}
