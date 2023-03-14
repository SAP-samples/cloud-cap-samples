const { generate, BLANK_PDF } = require("@pdfme/generator");

/**
 * Generate PDF with @pdfme/generator library
 */
module.exports = async (data, headers) => {

  let inputs = data

  let x = 0, y = 0;
  const width = 30;
  const height = 5;

  const tableSchema = {}
  for (const entry of headers) {
    x += width;
    tableSchema[entry.Name] = {
      type: 'text',
      position: { x, y: 10 },
      width,
      height
    }
  }

  for (const row of data) {
    for (const [key, value] of Object.entries(row)) {
      if (typeof value !== 'string')  row[key] = ''+value // stringify
    }
  }

  const template = {
    basePdf: BLANK_PDF,
    schemas: [tableSchema]
  };
  const pdf = await generate({ template, inputs });

  return pdf;
};
