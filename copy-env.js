const fs = require('fs')
const path = require('path')

const secretfile = process.env.SECRETFILE ? process.env.SECRETFILE : ''

// File .cdsrc.json will be created or overwritten by default.
if (
  secretfile.length > 0 &&
  !fs.existsSync(path.join(__dirname, '.cdsrc.json.bak'))
) {
  try {
    fs.copyFile(
      path.join(__dirname, '.cdsrc.json'),
      path.join(__dirname, '.cdsrc.json.bak'),
      err => {
        if (err) throw err
        console.log('.cdsrc.json.bak was copied to .cdsrc.json')
      }
    )
    fs.copyFile(`${secretfile}`, path.join(__dirname, '.cdsrc.json'), err => {
      if (err) throw err
      console.log(`${secretfile} was copied to .cdsrc.json`)
    })
    fs.chmodSync(path.join(__dirname, '.cdsrc.json'), '0777')
  } catch (error) {
    console.error(`${secretfile} could not be copied to .cdsrc.json`)
  }
} else {
  console.warn(
    'No secretfile given or secretfile was already copied, using .cdsrc.json'
  )
}
