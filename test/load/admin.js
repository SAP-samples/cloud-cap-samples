/* globals: __ENV */

import { sleep } from 'k6'
import http from 'k6/http'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'

import encoding from 'k6/encoding'

// const binding = JSON.parse(open('./key.json'))

/**
 * Authenticate using OAuth against SCP
 * @function
 */
export function authenticateUsingOauth () {
  let url
  const clientId = '' // process.env.CLIENT_ID
  const clientSecret = ''

  const requestBody = {
    client_id: clientId,
    client_secret: clientSecret
  }

  url =
    'https://dev-appl-cust-cf.authentication.eu10.hana.ondemand.com/oauth/token'
  requestBody.grant_type = 'client_credentials'

  const response = http.post(url, requestBody)
  return response.json()
}

export function setup () {
  const retVal = {}
  // retVal.access_token = authenticateUsingOauth().access_token

  const credentials = `${__ENV.LOAD_TEST_USER}:${__ENV.LOAD_TEST_PASSWORD}`
  retVal.encodedCredentials = encoding.b64encode(credentials)

  return retVal
}

export default function (data) {
  const params = {
    headers: {
      Authorization: `Basic ${data.encodedCredentials}`,
      'Content-Type': 'application/json'
    }
  }

  const res = http.get(`${__ENV.LOAD_TEST_URL}/processor/Travel`, params)
  sleep(1)
}

export function handleSummary (data) {
  return {
    'load-test-result.html': htmlReport(data)
  }
}

/* eslint-enable */
