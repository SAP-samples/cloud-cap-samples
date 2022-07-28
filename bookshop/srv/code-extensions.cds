//this file is machine-created during cds.build
namespace sap.capire.bookshop; //> important for reflection
using from '../db/schema';
using from '../srv/cat-service';
using from '../srv/admin-service';

annotate AdminService.Authors with @extension.logic: [{when: 'CREATE', code: 'async function run() {\r\n  \/\/debugger\r\n  \/\/while (true) {}\r\n  \/\/process.exit()\r\n  \/\/1.substring()\r\n  \/\/ let res = await specialselect\r\n  let res = await SELECT.one`title`.from(`Books`).where(`ID=201`)\r\n  let { title } = res\r\n  let Author = req.data\r\n  Author.modifiedBy = \"Custom Event handler changed this!\"\r\n  Author.placeOfDeath = \" --- Somewhere over \" + title + \" --- create in Sandbox\"\r\n  \/\/await this.emit(\"createdAuthor\", { Author })\r\n  return Author\r\n}\r\nrun()\r\n'},
{when: 'READ', code: 'function getYear(v) {\r\n  return parseInt(v.substr(0, 4))\r\n}\r\nfunction getMonth(v) {\r\n  return parseInt(v.substr(5, 2))\r\n}\r\nfunction getDay(v) {\r\n  return parseInt(v.substr(8, 2))\r\n}\r\n\r\nfunction getAge(from, to) {\r\n  if (from === undefined || from == null) return 0\r\n  if (to === undefined || to == null) to = new Date().toISOString()\r\n  let year = getYear(to) - getYear(from) - 1\r\n  if (\r\n    getMonth(to) > getMonth(from) ||\r\n    (getMonth(to) === getMonth(from) && getDay(to) >= getDay(from))\r\n  ) {\r\n    year++\r\n  }\r\n  return year\r\n}\r\n\r\nconst result_ = Array.isArray(result) ? result : [result]\r\nfor (const row of result_) {\r\n  row.modifiedBy += \" --- read in sandbox\"\r\n  row.age = getAge(row.dateOfBirth, row.dateOfDeath)\r\n}'}
];
annotate AdminService.Books with @extension.logic;
annotate CatalogService.ListOfBooks with @extension.logic;