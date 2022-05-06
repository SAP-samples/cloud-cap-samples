async function run() {
  debugger
  while (true) {}
  process.exit()
  //1.substring()
  let res = await cds.read(SELECT.one`title`.from(`Books`).where(`ID=201`))
  let { title } = res
  const data = req.data
  data.modifiedBy = "Custom Event handler read changed this!";
  data.placeOfDeath = ' --- Somewhere over ' + title + ' --- create in Sandbox'
  return data
}
output = run()
