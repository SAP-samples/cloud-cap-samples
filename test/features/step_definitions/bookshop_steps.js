const { Given, When, Then, AfterAll } = require('@cucumber/cucumber')
const { Builder, By } = require('selenium-webdriver')
const browser = (new Builder).forBrowser('safari').build()
const cds = require ('@sap/cds/lib')

process.env.cds_requires_auth_strategy = 'dummy'

let axios = require('axios').default
let {display} = browser

When('we run the {string} server', project => cds.exec('watch', project))
Then('it should listen at {string}', baseURL => {
  axios = axios.create({ baseURL })
  display = url => browser.get (baseURL+url)
  return axios.head()
})
Then('terminate the server', ()=> process.exit())



When(/wait for (\d+)\s*(\w+)/, {timeout:60*1000}, (delay, unit, done) => {
  const factor = {
    ms: 1,
    s: 1000, sec: 1000, second: 1000, seconds: 1000,
    m: 60*1000, min: 60*1000, minute: 60*1000, minutes: 60*1000,
    h: 60*60*1000, hr: 60*60*1000, hour: 60*60*1000, hours: 60*60*1000,
  }[unit]
  if (!factor) throw `Unknown duration unit: ${unit}`
  setTimeout (done, delay * factor)
})

AfterAll(()=> setTimeout (process.exit, 111))





When('we open page {string}', page => display(page))

Then('it should list these rows in table {string}:', async (id,data) => {
  let rows = await browser.findElements(By.css(`#${id} tr`)); rows.shift()
  await Promise.all (data.rawTable.map (async (row,i)=>{
    const tr = await rows[i].getText()
    for (let each of row) if (!tr.match(each)) throw `Didn't find '${each}' in web page as expected`
  }))
})

When(/we click on the (\d+)(?:st|nd|rd|th) row in table '(\w+)'/, async (row, id) => {
  let rows = await browser.findElements(By.css(`#${id} tr`))
  let td = await rows[row].findElement(By.css('td'))
  return td.click()
})

When('we enter {string} into {string}', async (value,id) => {
  const field = await browser.findElement(By.css(`input#${id}`))
  return field.sendKeys('\b\b\b\b\b\b',value)
})

When('we click on button {string}', async (text) => {
  const button = await browser.findElement(By.css(`input[value='${text}']`))
  return button.click()
})

Then('it succeeds with {string}', async message => {
  const element = await browser.wait (browser.findElement(By.css(`span.succeeded`)))
  return (await element.getText()).includes(message)
})

Then('it fails with {string}', async message => {
  const element = await browser.wait (browser.findElement(By.css(`span.failed`)))
  return (await element.getText()).includes(message)
})

Then('it shows {string} in {string}', async (message,id) => {
  const element = await browser.wait (browser.findElement(By.id(id)))
  return (await element.getText()).includes(message)
})

Given('we login as {string}, {string}', async (username, password) => {
  const alert = await browser.switchTo().alert()
  return alert.authenticateAs(username, password)
})
