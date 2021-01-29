const { parse:{cql:CQL}, test:{expect}} = require("@sap/cds/lib")
const { parser:{parse:OData} } = require("../lib/odata2cqn")

describe("$filter", () => {
  // logger can be omitted
  // afterEach(function () {
  //   logParserResult(newParserRes, `${this.currentTest.title}-new`);
  //   logParserResult(currentParserRes, `${this.currentTest.title}-cur`);
  // });

  describe("comparing expressions", () => {

    const types = {
      strings: "'some string'",
      'safe integers': 11,
      'unsafe integers': 2e53,
      decimals: 0.99,
      // ...
    }
    it.each(Object.keys(types))("should support expressions with %s", (t) => {
      expect (OData(`Foo?$filter=bar eq ${types[t]}`))
      .to.eql (CQL(`SELECT from Foo where bar = ${types[t]}`))
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
      expect (OData(`Foo?$filter=bar ${op} 11`))
      .to.eql (CQL(`SELECT from Foo where bar ${operators[op]} 11`))
    })

  });

  describe("logical expressions", () => {

    it.each(['and','or'])("should support '%s'", (t) => {
      expect (OData(`Foo?$filter=bar lt 11 and name eq 'some name'`))
      .to.eql (CQL(`SELECT from Foo where bar < 11 and name = 'some name'`))
    })

    it("should support 'not'", () => {
      // REVISIT: We need to check with the Node.js team why they translated that to the equivalent of:
      // not name like concat('%','sunny','%') escape '^'
      expect (OData(`Foo?$filter= not contains(name,'sunny')`))
      .to.eql (CQL(`SELECT from Foo where not name like '%sunny%'`))
    });

    it("should support group expr", () => {
      expect (OData(`Foo?$filter= (unitPrice lt 11 and length(name) eq 12) or name eq 'Restless and Wild'`))
      .to.eql (CQL(`SELECT from Foo where (unitPrice < 11 and length(name) = 12) or name = 'Restless and Wild'`))
    });
  });

  describe("function expressions", () => {

    it("should support contains", () => {
      expect (OData(`Foo?$filter= contains(name,'sunny')`))
      .to.eql (CQL(`SELECT from Foo where name like '%sunny%'`))
    });

    it("should support startswith", () => {
      expect (OData(`Foo?$filter= startswith(name,'sunny')`))
      .to.eql (CQL(`SELECT from Foo where name like 'sunny%'`))
    });

    it("should support endswith", () => {
      expect (OData(`Foo?$filter= endswith(name,'sunny')`))
      .to.eql (CQL(`SELECT from Foo where name like '%sunny'`))
    });

    it("should support length", () => {
      expect (OData(`Foo?$filter= length(name) lt 11`))
      .to.eql (CQL(`SELECT from Foo where length(name) < 11`))
    });

    it("should support indexof", () => {
      expect (OData(`Foo?$filter= indexof(name,'x') eq 11`))
      .to.eql (CQL(`SELECT from Foo where locate(name,'x') = 11`))
    });

    it("should support substring", () => {
      expect (OData(`Foo?$filter= substring(name,1) eq 'foo'`))
      .to.eql (CQL(`SELECT from Foo where substring(name,1) = 'foo'`))
    });

    it.each(['tolower','toupper','trim'])("should support '%s'", (fn) => {
      expect (OData(`Foo?$filter= ${fn}(name) eq 'foo'`))
      .to.eql (CQL(`SELECT from Foo where ${fn.replace(/^to/,'')}(name) = 'foo'`))
    });

    it("should support 'day'", () => {
      expect (OData(`Foo?$filter= day(name) eq 11`))
      .to.eql (CQL(`SELECT from Foo where dayofmonth(name) = 11`))
    });

    it("should support concat", () => {
      expect (OData(`Foo?$filter= concat(name,'o') eq 'foo'`))
      .to.eql (CQL(`SELECT from Foo where concat(name,'o') = 'foo'`))
    });

  });
});
