module.exports = {
    meta: {
      docs: {
        description: "Service without `@requires/restrict` should not expose fields with personal data.",
        version: "1.0.0"
      },
      fixable: "code",
      model: "inferred"
    },
    create: function (context) {
      const services = context.getModel() ? context.getModel().services : [];
      const unprotectedServices = services.filter(s => !s["@requires"] && !s["@restrict"]).map(s => s.name)
      return { entity: checkForExposedFields };

      function checkForExposedFields(entity) {
        const entityInUnprotectedService = unprotectedServices.some(service => entity.name.includes(service))
        if (entityInUnprotectedService) {
          const elements = Object.keys(entity.elements).filter((name) => ["createdBy", "modifiedBy"].includes(name))
          for (let element of elements) {
            context.report({
              message: `Field '${element}' in '${entity.name}' exposes personal data. Remove field or add \`@restrict/requires\`.`,
              node: context.getNode(entity),
              file: entity.$location.file
            })
          }
        }
      }
    }
  }
