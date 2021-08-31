module.exports = class say {
    hello(req: any) {
        return `Hello ${req.data.to} from a TypeScript file!`
    }
}
