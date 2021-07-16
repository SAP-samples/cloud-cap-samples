let { API_BUSINESS_PARTNER:S4 } = cds.services

// Mocking event emitter according to:
// https://api.sap.com/event/SAPS4HANACloudBusinessEvents_BusinessPartner/resource
S4.after ('UPDATE', 'A_BusinessPartner', data =>
  S4.emit ('BusinessPartner.Changed', { BusinessPartner: data.BusinessPartner })
)
