async function run() {
  //debugger
  //while (true) {}
  //process.exit()
  //1.substring()
  // let res = await specialselect
  let res = await SELECT.one`title`.from(`Books`).where(`ID=201`)
  let { title } = res
  let Author = req.data
  //await srv.read('Books')
  
  Author.modifiedBy = "Custom Event handler changed this!"
  Author.placeOfDeath = " --- Somewhere over " + title + " --- create in Sandbox"
  //await this.emit("createdAuthor", { Author })
  return Author
}
run()
