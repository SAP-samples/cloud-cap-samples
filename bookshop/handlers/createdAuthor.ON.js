async function run() {
  let {Author} = req.data
  Author.placeOfBirth += ' --- modified in custom event' 
}
run()