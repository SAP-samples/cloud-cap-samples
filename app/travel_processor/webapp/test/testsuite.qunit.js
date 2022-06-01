/* global window, parent, location */
window.suite = function () {
  'use strict'

  const oSuite = new parent.jsUnitTestSuite()
  const sContextPath = location.pathname.substring(0, location.pathname.lastIndexOf('/'))

  oSuite.addTestPage(`${sContextPath}/integration/Opa.qunit.html`)

  return oSuite
}
