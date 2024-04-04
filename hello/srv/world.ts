import { Request } from "@sap/cds"

module.exports = class say {
    hello(req: Request) {
        return `Hello ${req.data.to} from a TypeScript file!`
    }
}
