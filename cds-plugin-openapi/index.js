/* eslint-disable require-await */
const cds = require('@sap/cds'), { BuildTaskHandler } = cds.build
const cdsdk = require('@sap/cds-dk')

cds.build.register(class OpenApiHandler extends BuildTaskHandler {
    static get meta() {
        return {
            id: 'openapi',
            runWith: ['node-cf', 'java-cf'],
            config: { src: cds.env.folders.srv.replace(/\/$/, '') }
        }
    }
    async clean() {
        return this.remove('openapi-docs')
    }
    async build() {
        const model = await this.model()
        const { options } = this.task

        // generate openapi files for all services
        await Promise.all(cds.linked(model).services.map(service => {
            const openApi = cdsdk.compile.to.openapi(model, {
                service: service.name,
                'openapi:diagram': String(options.diagram) === 'true'
            })
            this.write(openApi).to(`openapi-docs/${service.name}.openapi3.json`)
        }))
    }
})