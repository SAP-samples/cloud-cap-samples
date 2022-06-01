const puppeteer = require('puppeteer')
const cap = require('./karma/cap-server')

process.env.CHROME_BIN = puppeteer.executablePath()

module.exports = async (config) => {
  // start the CAP server (either specify CLI arg --server=node or --server=java)
  let capMiddleware
  if (config.server === 'node') {
    capMiddleware = cap.node()
  } else if (config.server === 'java') {
    capMiddleware = cap.java()
  } else {
    throw new Error(`Unknown server type: ${config.server}`)
  }

  config.set({

    customLaunchers: {
      Chrome_without_security: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    frameworks: ['ui5'],
    logLevel: 'INFO', // log errors only. Change to "DEBUG" for more verbosity
    proxies: {
      '/base/webapp/processor': '/processor'
    },
    ui5: {
      url: 'https://ui5.sap.com'
    },
    plugins: [...config.plugins, await capMiddleware],
    middleware: ['cap-proxy'],
    browsers: ['Chrome_without_security'],
    singleRun: config.ci || config.singleRun || false,
    browserNoActivityTimeout: 180000,
    browserDisconnectTimeout: 120000
  })
}
