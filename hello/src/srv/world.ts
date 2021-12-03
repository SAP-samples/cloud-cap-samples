import type { Request } from "@sap/cds/apis/services";

module.exports = class say {
  hello(req: Request) {
    return `Hello ${req.data.to} from a TypeScript file!`;
  }
};
