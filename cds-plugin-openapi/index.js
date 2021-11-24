/* eslint-disable require-await */
const path = require("path")
const fs = require("fs")
const cds = require('@sap/cds'), { BuildTaskProvider, BuildTaskHandler } = cds.build
const cdsdk = require('@sap/cds-dk')
const logger = cds.log("build")

// module.exports.activate = () => {
    cds.build.registerProvider(
        new (class extends BuildTaskProvider {
            get id() {
                return 'openapi'
            }
            get dependents() {
                return ['node-cf', 'java-cf']
            }
            applyTaskDefaults(task) {
                task.src = task.src || cds.env.folders.srv.replace(/\/$/, '')
            }
            get handler() {
                return class extends BuildTaskHandler {
                    async clean() {
                        fs.rm(path.join(this.task.dest, "openapi-docs"), { recursive: true, force: true }, (err) => err ? logger.error(err) : '')
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
                }
            }
            /**
             * Additional constraints can be defined, e.g. generate openapi service specification in production builds only.
             * > cds build --production
             * > cds build --for node-cf --production 
             */ 
            // async lookupTasks() {
            //     if (process.env.NODE_ENV === 'production') {
            //         return [{ for: this.id }]
            //     }
            // }
        })()
    )
// }