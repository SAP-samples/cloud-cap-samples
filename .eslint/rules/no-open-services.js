module.exports = {
    meta: {
      docs: {
        description: "Service without `@requires/restrict` should not expose fields `createdBy` and `modifiedBy`.",
        version: "1.0.0"
      },
      fixable: "code",
      model: "inferred"
    },
    create: function (context) {
      return { entity: checkForExposedFields };

      function checkForExposedFields(e) {
        const services = context.getModel().services;
        const unauthorizedServices = services
          .map((s) => {
            if (!s["@requires"] && !s["@restrict"]) {
              return s.name;
            }
          })
          .filter((item) => !!item);
        const found = Object.keys(e.elements).find((r) => ["createdBy", "modifiedBy"].indexOf(r) >= 0);
        const isUnauthorizedService = unauthorizedServices.some((r) => {
          if (e.name.includes(r)) {
            return true;
          }
          return false;
        });
        if (found && isUnauthorizedService) {
          context.report({
            message: `Danger - exposed field '${found}' with '${e.name}' Either remove these or add add \`@restrict/requires\`.`,
            node: context.getNode(e),
            file: e.$location.file
          });
        }
      }
    }
  };
