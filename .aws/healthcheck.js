const http = require('http')

const options = {
  host: 'localhost',
  port: '4004',
  timeout: 2000,
  path: '/healthcheck'
}

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`)
  if (res.statusCode === 200) {
    process.exit(0)
  } else {
    process.exit(1)
  }
})

request.on('error', function (err) {
  console.log('ERROR', err)
  process.exit(1)
})

request.end()
