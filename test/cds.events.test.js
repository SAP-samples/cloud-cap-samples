const cds = require ('@sap/cds/lib')
const { expect } = cds.test.in (__dirname)

describe('cds.events tests', ()=>{

  let m; before (async ()=> m = await cds.load('events.cds'))

  it ('should have the model loaded', ()=>{
    expect(m.definitions).to.have.property('Sue.Foo')
  })

  it ('should compile the model to edmx', ()=>{
    const edmx = cds.compile(m).to.edmx({service:'Sue'})
    expect(edmx).to.match(/<EntitySet Name="Foo" EntityType="Sue.Foo"\/>/)
  })

  it ('should compile the model to sql', ()=>{
    const sql = cds.compile(m).to.sql().join(';\n')
    expect(sql).not.to.match(/CREATE TABLE Sue_Foo/)
    expect(sql).to.match(/CREATE TABLE Sue_Bar/)
  })
})
