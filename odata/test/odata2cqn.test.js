const cds = require("@sap/cds/lib"), {expect} = cds.test
cds.odata = require("../lib")

describe("$filter", () => {

  describe("comparing expressions", () => {

    const types = {
      strings: "'some string'",
      integers: 11,
      decimals: 0.99,
      // ...
    }
    it.each(Object.keys(types))("should support expressions with %s", (t) => {
      expect (cds.odata.parse.url(`Foo?$filter=bar eq ${types[t]}`))
      .to.eql (cds.parse.cql(`SELECT from Foo where bar = ${types[t]}`))
    })

    const operators = {
      eq: '=',
      lt: '<',
      le: '<=',
      gt: '>',
      ge: '>=',
      ne: '!=',
      // ...
    }
    it.each(Object.keys(operators))("should support comparison operator '%s'", (op) => {
      expect (cds.odata.parse.url(`Foo?$filter=bar ${op} 11`))
      .to.eql (cds.parse.cql(`SELECT from Foo where bar ${operators[op]} 11`))
    })

  });

  describe("logical expressions", () => {

    it.each(['and','or'])("should support '%s'", (t) => {
      expect (cds.odata.parse.url(`Foo?$filter=bar lt 11 ${t} name eq 'some name'`))
      .to.eql (cds.parse.cql(`SELECT from Foo where bar < 11 ${t} name = 'some name'`))
    })

    it("should support 'not'", () => {
      // REVISIT: We need to check with the Node.js team why they translated that to the equivalent of:
      // not name like concat('%','sunny','%') escape '^'
      expect (cds.odata.parse.url(`Foo?$filter= not contains(name,'sunny')`))
      .to.eql (cds.parse.cql(`SELECT from Foo where not contains(name,'sunny')`))
    });

    // REVISIT: wait for compiler v2
    it("should support group expr", () => {
      expect (cds.odata.parse.url(`Foo?$filter= (unitPrice gt 11 and length(name) eq 12) or name eq 'Restless and Wild'`))
      .to.eql (cds.parse.cql(`SELECT from Foo where (unitPrice > 11 and length(name) = 12) or name = 'Restless and Wild'`))
    });
  });

  describe("function expressions", () => {

    it("should support contains", () => {
      expect (cds.odata.parse.url(`Foo?$filter= contains(name,'sunny')`))
      .to.eql (cds.parse.cql(`SELECT from Foo where contains(name,'sunny')`))
    });

    it("should support startswith", () => {
      expect (cds.odata.parse.url(`Foo?$filter= startswith(name,'sunny')`))
      .to.eql (cds.parse.cql(`SELECT from Foo where startswith(name,'sunny')`))
    });

    it("should support endswith", () => {
      expect (cds.odata.parse.url(`Foo?$filter= endswith(name,'sunny')`))
      .to.eql (cds.parse.cql(`SELECT from Foo where endswith(name,'sunny')`))
    });

    it("should support length", () => {
      expect (cds.odata.parse.url(`Foo?$filter= length(name) lt 11`))
      .to.eql (cds.parse.cql(`SELECT from Foo where length(name) < 11`))
    });

    it("should support indexof", () => {
      expect (cds.odata.parse.url(`Foo?$filter= indexof(name,'x') eq 11`))
      .to.eql (cds.parse.cql(`SELECT from Foo where indexof(name,'x') = 11`))
    });

    it("should support substring", () => {
      expect (cds.odata.parse.url(`Foo?$filter= substring(name,1) eq 'foo'`))
      .to.eql (cds.parse.cql(`SELECT from Foo where substring(name,1) = 'foo'`))
    });

    it.each(['tolower','toupper','trim'])("should support '%s'", (fn) => {
      expect (cds.odata.parse.url(`Foo?$filter= ${fn}(name) eq 'foo'`))
      .to.eql (cds.parse.cql(`SELECT from Foo where ${fn}(name) = 'foo'`))
    });

    it("should support 'day'", () => {
      expect (cds.odata.parse.url(`Foo?$filter= day(name) eq 11`))
      .to.eql (cds.parse.cql(`SELECT from Foo where day(name) = 11`))
    });

    it("should support concat", () => {
      expect (cds.odata.parse.url(`Foo?$filter= concat(name,'o') eq 'foo'`))
      .to.eql (cds.parse.cql(`SELECT from Foo where concat(name,'o') = 'foo'`))
    });

  });

});
