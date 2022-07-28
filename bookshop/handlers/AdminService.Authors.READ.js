function getYear(v) {
  return parseInt(v.substr(0, 4))
}
function getMonth(v) {
  return parseInt(v.substr(5, 2))
}
function getDay(v) {
  return parseInt(v.substr(8, 2))
}

function getAge(from, to) {
  if (from === undefined || from == null) return 0
  if (to === undefined || to == null) to = new Date().toISOString()
  let year = getYear(to) - getYear(from) - 1
  if (
    getMonth(to) > getMonth(from) ||
    (getMonth(to) === getMonth(from) && getDay(to) >= getDay(from))
  ) {
    year++
  }
  return year
}

async function run() {
  const result_ = Array.isArray(result) ? result : [result]
  for (const row of result_) {
    row.age = getAge(row.dateOfBirth, row.dateOfDeath)
    let res = await SELECT.one`title`.from(`Books`).where({ author_ID: row.ID })
    if (!res) {
      res = {}
    }
    let { title } = res
    if (!title) {
      title = "no Books yet"
    }
    row.exampleBook = title
    //let pub = await SELECT.one`name`.from(`sap_capire_bookshop_Publishers`)
  }
}

run()
