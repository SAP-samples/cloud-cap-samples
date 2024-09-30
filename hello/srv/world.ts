import cds from '@sap/cds'
export class say extends cds.ApplicationService {
  hello (to : String = 'World') {
    return `Hello ${to} from TypeScript!`
  }
}
