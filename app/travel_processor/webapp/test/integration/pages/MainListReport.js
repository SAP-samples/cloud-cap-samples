sap.ui.define(['sap/fe/test/ListReport'], function (ListReport) {
  'use strict'

  // OPTIONAL
  const AdditionalCustomListReportDefinition = {
    actions: {},
    assertions: {}
  }

  return new ListReport(
    {
      appId: 'sap.fe.cap.travel',
      componentId: 'TravelList',
      entitySet: 'Travel'
    },
    AdditionalCustomListReportDefinition
  )
})
