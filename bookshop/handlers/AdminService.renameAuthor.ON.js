async function run() {
  const {author, newName} = req.data
  let a = await SELECT `name`.from(`Authors`).where({ID: author})
  if(!a) return req.error (404, `Can't rename a non-existing author`)
  await UPDATE (`Authors`,author).with ({ name: newName })
    //await this.emit ('renamedAuthor', { author, newName })
  output.msg = 'Success' 
}
run()
